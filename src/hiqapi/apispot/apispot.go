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
)
var db *hiqdb.HiQDb
var broker *hiqeventstream.Broker

const FLARE = "HiQSpotApi:"

func getAll(w http.ResponseWriter, r *http.Request, myUser *user.User){
	var jspots = make([]hiqjson.JSpot, 0)
	var userSpot *spot.Spot

	if myUser != nil {
		userSpot, _ = spot.GetByUserID(db, *myUser.ID)
	}
	for _,s := range spot.GetAll(db){
		jspot := spotToJResponse(s)
		if myUser != nil{
			jspot.CanModify = (!s.IsParked && (userSpot == nil)) || (userSpot != nil && userSpot.ID == s.ID)
		}

		jspots = append(jspots, jspot)
	}
	jsonResp := hiqjson.AsJson(jspots)
	broker.Notifier <- []byte(jsonResp)
	fmt.Fprintf(w, jsonResp)
}

func get(w http.ResponseWriter, r *http.Request, user *user.User){
	var s spot.Spot
	hiqjson.Parse(r.Body, &s)
	if ok := spot.Get(db, &s); ok {
		fmt.Fprintf(w, hiqjson.AsJson(spotToJResponse(s)))
	}else {
		fmt.Fprintf(w, hiqjson.AsJson(hiqjson.GENERAL_ERROR_MSG))
	}


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
					getAll(w, r, myUser)
					return
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
					getAll(w, r, myUser)
					return
				}else{
					fmt.Fprintf(w, hiqjson.AsJson(hiqjson.JResponse{Error:true, Message:"You are not allowed to park in two spots."}))
				}
			}
		}else{
			fmt.Fprintf(w, hiqjson.AsJson(hiqjson.GENERAL_ERROR_MSG))
		}
	}else{
		fmt.Fprintf(w, hiqjson.AsJson(hiqjson.LOGIN_ERROR_MSG))
	}

}

func spotToJResponse(s spot.Spot) hiqjson.JSpot{
	jspot := hiqjson.JSpot{
		ID:s.ID,
		Name: s.Name,
		IsParked: s.IsParked,
		CanModify:false,
	}
	if s.IsParked{
		usr := user.User{ID:&s.ParkedBy}
		if err := user.Get(db, &usr); err == nil {
			jspot.ParkedBy = usr.Username
			jspot.ParkedTime = s.ParkedTime
		}else{
			log.Printf("%v %v", FLARE, err)
		}
	}
	return jspot
}

func Register(hiqdb *hiqdb.HiQDb, master *hiqapi.ApiMaster){
	broker = hiqeventstream.NewServer()
	db = hiqdb
	log.Printf("%v Registring.", FLARE)
	master.Register("spot/getAll", getAll)
	master.Register("spot/get", get)
	master.Register("spot/toggle", toggle)

	master.RegisterEventStream("spot", broker.ServeHTTP)
	log.Printf("%v Registred.",FLARE)
}
