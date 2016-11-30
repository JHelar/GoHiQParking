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
	if user, err := user.Create(db, data.Email, data.Username, data.Password); err == nil {
		ses, _ := session.NewUserSession(db, *user.ID)
		fmt.Fprintf(w, hiqjson.AsJson(*ses))
	}else{
		fmt.Fprintf(w, hiqjson.AsJson(err))
	}
}

func login(w http.ResponseWriter, r *http.Request, nope *user.User)  {
	data := struct {
		UsernameEmail string `json:"usernameemail"`
		Password string `json:"password"`
	}{}
	hiqjson.Parse(r.Body, &data)

	if user, err := user.GetByLogin(db, data.UsernameEmail, data.Password); err == nil {
		ses,_:= session.NewUserSession(db, *user.ID)
		fmt.Fprint(w, hiqjson.AsJson(*ses))
	}else{
		fmt.Fprintf(w, hiqjson.AsJson(err))
	}
}

func logout(w http.ResponseWriter, r *http.Request, myUser *user.User){
	if(myUser != nil){
		ses, err := session.GetByUserID(db, *myUser.ID)
		if err == nil {
			if err = session.Delete(db, ses); err == nil {
				fmt.Fprintf(w, hiqjson.AsJson("Succsess."))
				return
			}
		}
		fmt.Fprintf(w, hiqjson.AsJson(err))
	}else{
		fmt.Fprint(w, hiqjson.LOGIN_ERROR_MSG)
	}
}

func get(w http.ResponseWriter, r *http.Request, myUser *user.User){
	if(myUser != nil){
		fmt.Fprintf(w, hiqjson.AsJson(*myUser))
	}else{
		fmt.Fprintf(w, hiqjson.LOGIN_ERROR_MSG)
	}
}

func Register(hiqdb *hiqdb.HiQDb, master *hiqapi.ApiMaster){
	db = hiqdb
	log.Printf("%v Registring.", FLARE)
	master.Register("user/register", register)
	master.Register("user/login", login)
	master.Register("user/logout", logout)
	master.Register("user/get", get)
	log.Printf("%v Registred.",FLARE)
}
