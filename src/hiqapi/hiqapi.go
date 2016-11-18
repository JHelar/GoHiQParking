package hiqapi

import (
	"net/http"
	"log"
	"fmt"
	"strings"
	"hiqapi/hiqjson"
	"hiqdb/user"
)

type ApiMaster struct {
	childHandlers map[string]func(http.ResponseWriter, *http.Request, *user.User)
}

var master *ApiMaster

func (master *ApiMaster) RegisterChild(pattern string, handler func(http.ResponseWriter, *http.Request, *user.User)){
	master.childHandlers[pattern] = handler
}
const FLARE = "HiQApi"

func apiHandler(w http.ResponseWriter, r *http.Request){
	//Make sure user is logged in!


	apiPath := strings.TrimPrefix(r.URL.Path, "/api/")
	if val, ok := master.childHandlers[apiPath]; ok {
		w.Header().Set("Content-Type", "application/json")
		val(w, r, nil)
	}else{
		fmt.Fprintf(w, hiqjson.AsJson(hiqjson.GENERAL_ERROR_MSG))
	}

}

func init()  {
	master = &ApiMaster{childHandlers:make(map[string]func(http.ResponseWriter, *http.Request, *user.User))}
}

func Start(mux *http.ServeMux) *ApiMaster{
	log.Printf("%v Setting api listeners...", FLARE)
	mux.HandleFunc("/api/", apiHandler)
	return master
}
