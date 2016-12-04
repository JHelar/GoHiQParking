package apilot

import (
	"hiqdb"
	"hiqapi"
	"log"
	"net/http"
	"hiqdb/user"
	"hiqdb/parkinglot"
	"fmt"
	"hiqapi/hiqjson"
	"hiqdb/spot"
)
const FLARE = "HiQLot:"
var db *hiqdb.HiQDb

func getAll(w http.ResponseWriter, r *http.Request, myUser *user.User){
	if lots, err := parkinglot.GetAll(db, false); err == nil {
		fmt.Fprintf(w, hiqjson.AsJson(lots))
	}else{
		fmt.Fprint(w, hiqjson.GENERAL_ERROR_MSG)
	}
}

func fill(w http.ResponseWriter, r *http.Request, myUser *user.User){
	var lot parkinglot.ParkingLot
	hiqjson.Parse(r.Body, &lot)

	if err := parkinglot.SetSpots(db, &lot); err == nil {
		var userSpot *spot.Spot

		jlot := lot.AsJson(db).(parkinglot.JParkingLot)

		if myUser != nil {
			userSpot, _ = spot.GetByUserID(db, *myUser.ID)
			for i,_ := range jlot.Spots{
				jspot := jlot.Spots[i].(spot.JSpot)
				jspot.CanModify = ((!jspot.IsParked && (userSpot == nil)) || (userSpot != nil && userSpot.ID == jspot.ID) && myUser != nil)
				jlot.Spots[i] = jspot
			}
		}

		fmt.Fprintf(w, hiqjson.AsJson(jlot))
	}else{
		fmt.Fprintf(w, hiqjson.AsJson(err))
	}
}

func register(master *hiqapi.ApiMaster, hiqdb *hiqdb.HiQDb){
	db = hiqdb
	log.Printf("%v Registring.", FLARE)
	master.Register("lot/getAll", getAll)
	master.Register("lot/fill", fill)
	log.Printf("%v Registred", FLARE)
}

func New()*hiqapi.ApiChild{
	return &hiqapi.ApiChild{Register:register}
}