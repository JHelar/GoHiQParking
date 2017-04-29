package apispot

import (
	"net/http"
	"hiqdb/spot"
	"hiqdb"
	"hiqapi/hiqjson"
	"fmt"
	"log"
	"hiqapi"
	"hiqdb/user"
	"time"
	"hiqeventstream"
	"reflect"
)
var db *hiqdb.HiQDb
//General event stream for view updates
var spotBroker *hiqeventstream.Broker
var checkSpots chan int

const FLARE = "HiQSpotApi:"

func getAll(w http.ResponseWriter, r *http.Request, myUser *user.User){
	//ToDo: Refactor this.

	var jspots = make([]interface{}, 0)
	var userSpot *spot.Spot

	if myUser != nil {
		userSpot, _ = spot.GetByUserID(db, *myUser.ID)
	}
	for _,s := range spot.GetAll(db){
		jspot := s.AsJson(db)
		if myUser != nil{
			reflect.ValueOf(jspot).FieldByName("CanModify").SetBool((!s.IsParked && (userSpot == nil)) || (userSpot != nil && userSpot.ID == s.ID))
		}

		jspots = append(jspots, jspot)
	}
	jsonResp := hiqjson.AsJson(jspots)
	fmt.Fprintf(w, jsonResp)
}

func getAllFromLot(w http.ResponseWriter, r *http.Request, myUser *user.User, lotID int){
	var jspots = make([]interface{}, 0)
	var userSpot *spot.Spot

	if myUser != nil {
		userSpot, _ = spot.GetByUserID(db, *myUser.ID)
	}
	for _,s := range spot.GetAllByLotID(db, lotID){
		jspot := s.AsJson(db).(spot.JSpot)
		if myUser != nil{
			jspot.CanModify = (!s.IsParked && (userSpot == nil)) || (userSpot != nil && userSpot.ID == s.ID)
		}

		jspots = append(jspots, jspot)
	}
	jsonResp := hiqjson.AsJson(jspots)
	fmt.Fprintf(w, jsonResp)
}

func toggle(w http.ResponseWriter, r *http.Request, myUser *user.User){
	if myUser != nil {
		//Get the requested spot from db, safer since people can temper with javascript.
		var s spot.Spot
		hiqjson.Parse(r.Body, &s)
		if ok := spot.Get(db, &s); ok {
			if s.IsParked {
				//Check if user is allowed to modify this spot.
				if s.ParkedBy == *myUser.ID {
					s.IsParked = false
					s.ParkedBy = 0
					ok = spot.Update(db, s)
					getAllFromLot(w, r, myUser, s.ParkingLot)
					//Send a spot check flag, and event update.
					//checkSpots <- s.ParkingLot
					spotBroker.Notifier <- hiqeventstream.Message{ClientOrigin:r.RemoteAddr, Message:hiqjson.GENERAL_UPDATE_MSG, EventType:hiqeventstream.EVENT_TYPE_UPDATE, EventChannel:fmt.Sprintf("%d",s.ParkingLot)}

				}else{
					fmt.Fprintf(w, hiqjson.AsJson(hiqjson.JResponse{Error:true, Message:"You are not allowed to modify this spot."}))
				}
			}else{
				_, err := spot.GetByUserID(db, *myUser.ID)
				//In this case we want an error, since then the user is not parked somewhere else.
				if err != nil{
					s.IsParked = true
					s.ParkedBy = *myUser.ID
					s.ParkedTime = time.Now()
					ok = spot.Update(db, s)
					getAllFromLot(w, r, myUser, s.ParkingLot)
					//Send a spot check flag, and event update.
					//checkSpots <- s.ParkingLot
					spotBroker.Notifier <- hiqeventstream.Message{ClientOrigin:r.RemoteAddr, Message:hiqjson.GENERAL_UPDATE_MSG, EventType:hiqeventstream.EVENT_TYPE_UPDATE, EventChannel:fmt.Sprintf("%d",s.ParkingLot)}

				}else{
					fmt.Fprintf(w, hiqjson.AsJson(hiqjson.JResponse{Error:true, Message:"You are not allowed to park in two spots."}))
				}
			}
		}else{
			fmt.Fprint(w, hiqjson.GENERAL_ERROR_MSG)
		}
	}else{
		fmt.Fprint(w, hiqjson.LOGIN_ERROR_MSG)
	}

	return
}

func pushListener(){
	go func(){
		for {
			select {
			case parkingLot := <- checkSpots:
			//Check if we need to push a notification.
				if spots := spot.GetFreeSpots(db, parkingLot);len(spots) <= 0 {
					spotBroker.Notifier <- hiqeventstream.Message{Message:hiqjson.NO_SPOTS_MSG, EventType:hiqeventstream.EVENT_TYPE_PUSH_NOTIFICATION, EventChannel:fmt.Sprintf("%d", parkingLot)}
				}else{
					spotBroker.Notifier <- hiqeventstream.Message{Message:hiqjson.FREE_SPOT_MSG, EventType:hiqeventstream.EVENT_TYPE_PUSH_NOTIFICATION, EventChannel:fmt.Sprintf("%d", parkingLot)}
				}
			}
		}
	}()
}

func Register(hiqdb *hiqdb.HiQDb, master *hiqapi.ApiMaster){
	spotBroker = hiqeventstream.NewServer()
	//checkSpots = make(chan int)

	db = hiqdb
	log.Printf("%v Registring.", FLARE)
	master.Register("spot/getAll", getAll)
	master.Register("spot/toggle", toggle)

	master.RegisterEventStream("spot", spotBroker.ServeHTTP)

	//pushListener()
	log.Printf("%v Registred.",FLARE)
}
