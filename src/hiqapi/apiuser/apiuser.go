package apiuser

import (
	"hiqdb"
	"net/http"
	"hiqdb/user"
	"hiqapi/hiqjson"
	"fmt"
	"hiqdb/session"
	"hiqapi"
	"log"
)

var db *hiqdb.HiQDb
const FLARE = "HiQUser:"

func register(w http.ResponseWriter, r *http.Request, nope *user.User){
	data := struct{
		Username string `json:"username"`
		Email string `json:"email"`
		Password string `json:"password"`
	}{}
	hiqjson.Parse(r.Body,&data)
	if user, ok := user.Create(db, data.Email, data.Username, data.Password); ok {
		ses, _ := session.NewUserSession(db, user.ID)
		fmt.Fprintf(w, hiqjson.AsJson(*ses))
	}else{
		fmt.Fprintf(w, hiqjson.MAIL_IN_USE_MSG)
	}
}

func Register(hiqdb *hiqdb.HiQDb, master *hiqapi.ApiMaster){
	db = hiqdb
	log.Printf("%v Registring.", FLARE)
	master.RegisterChild("user/register", register)
	log.Printf("%v Registred.",FLARE)
}
