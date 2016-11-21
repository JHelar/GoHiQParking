package hiqapi

import (
	"net/http"
	"log"
	"fmt"
	"strings"
	"hiqapi/hiqjson"
	"hiqdb/user"
	"hiqdb/session"
	"hiqsecurity"
	"hiqdb"
)

type ApiMaster struct {
	childHandlers map[string]func(http.ResponseWriter, *http.Request, *user.User)
}

var master *ApiMaster
var db *hiqdb.HiQDb

func (master *ApiMaster) Register(pattern string, handler func(http.ResponseWriter, *http.Request, *user.User)){
	master.childHandlers[pattern] = handler
}

func (master *ApiMaster) RetrieveUser(r *http.Request) (*user.User, error){
	sKey, err := hiqsecurity.GetSessionKeyFromHeader(r)
	if err == nil {
		ses := session.UserSession{
			SessionKey:sKey,
		}
		if err = session.Get(db, &ses); err == nil {
			usr := user.User{
				ID:&ses.UserID,
			}
			if err = user.Get(db, &usr); err == nil{
				return &usr, nil
			}
		}
	}
	return nil, err
}

const FLARE = "HiQApi"

func apiHandler(w http.ResponseWriter, r *http.Request){

	w.Header().Set("Content-Type", "application/json")
	apiPath := strings.TrimPrefix(r.URL.Path, "/api/")

	if val, ok := master.childHandlers[apiPath]; ok {
		//Retrive user if there is one.
		if usr, err := master.RetrieveUser(r); err == nil {
			val(w, r, usr)
		}else{
			val(w, r, nil)
		}
		return
	}else{
		fmt.Fprintf(w, hiqjson.AsJson(hiqjson.GENERAL_ERROR_MSG))
		return
	}

}

func init()  {
	master = &ApiMaster{childHandlers:make(map[string]func(http.ResponseWriter, *http.Request, *user.User))}
}

func Start(hiqdb *hiqdb.HiQDb, mux *http.ServeMux) *ApiMaster{
	db = hiqdb

	log.Printf("%v Setting api listeners...", FLARE)
	mux.HandleFunc("/api/", apiHandler)
	return master
}
