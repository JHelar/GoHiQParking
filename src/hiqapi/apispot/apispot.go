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
)
var db *hiqdb.HiQDb
const FLARE = "HiQSpotApi:"

func getAll(w http.ResponseWriter, r *http.Request, user *user.User){
	resp := hiqjson.AsJson(spot.GetAll(db))
	fmt.Fprintf(w, resp)
}

func get(w http.ResponseWriter, r *http.Request, user *user.User){
	var s spot.Spot
	hiqjson.Parse(r.Body, &s)
	if ok := spot.Get(db, &s); ok {
		fmt.Fprintf(w, hiqjson.AsJson(s))
	}else {
		fmt.Fprintf(w, hiqjson.AsJson(hiqjson.GENERAL_ERROR_MSG))
	}


}

func update(w http.ResponseWriter, r *http.Request, user *user.User){
	var s spot.Spot
	hiqjson.Parse(r.Body, &s)

	if ok := spot.Update(db, s); ok {
		fmt.Fprintf(w, hiqjson.AsJson("{'error':false}"))
	}else {
		fmt.Fprintf(w, hiqjson.AsJson(hiqjson.GENERAL_ERROR_MSG))
	}
}

func Register(hiqdb *hiqdb.HiQDb, master *hiqapi.ApiMaster){
	db = hiqdb
	log.Printf("%v Registring.", FLARE)
	master.RegisterChild("spot/getAll", getAll)
	master.RegisterChild("spot/get", get)
	master.RegisterChild("spot/update", update)
	log.Printf("%v Registred.",FLARE)
}
