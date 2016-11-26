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
	eventStreams map[string]func(http.ResponseWriter, *http.Request)
}

var master *ApiMaster
var db *hiqdb.HiQDb

func (master *ApiMaster) Register(pattern string, handler func(http.ResponseWriter, *http.Request, *user.User)){
	master.childHandlers[pattern] = handler
}

func (master *ApiMaster) RegisterEventStream(pattern string, handler func(http.ResponseWriter, *http.Request)){
	master.eventStreams[pattern] = handler
}

func (master *ApiMaster) RetrieveUser(r *http.Request) (*user.User, error){
	sKey, err := hiqsecurity.GetSessionKeyFromRequest(r)
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

func streamHandler(w http.ResponseWriter, r *http.Request){
	streamPath := strings.TrimPrefix(r.URL.Path, "/event/")
	if val, ok := master.eventStreams[streamPath]; ok {
		val(w, r)
		return
	}
}

func apiHandler(w http.ResponseWriter, r *http.Request){

	w.Header().Set("Content-Type", "application/json")


	apiPath := strings.TrimPrefix(r.URL.Path, "/api/")
	log.Printf("New request from: %v, requested: %v", r.RemoteAddr, apiPath)

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
	master = &ApiMaster{childHandlers:make(map[string]func(http.ResponseWriter, *http.Request, *user.User)),eventStreams:make(map[string]func(http.ResponseWriter, *http.Request))}
}

func Start(hiqdb *hiqdb.HiQDb, mux *http.ServeMux) *ApiMaster{
	db = hiqdb

	log.Printf("%v Setting api listeners...", FLARE)
	mux.HandleFunc("/api/", apiHandler)
	mux.HandleFunc("/event/", streamHandler)
	return master
}
