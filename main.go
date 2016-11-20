package main

import (
	"hiqdb"
	"log"
	"net/http"
	"text/template"
	"hiqapi"
	"hiqapi/apispot"
	"hiqdb/spot"
	"hiqapi/apiuser"
)

func index(w http.ResponseWriter, r *http.Request){
	tmp, err := template.ParseFiles("templates/layout.gohtml", "templates/home.gohtml")
	if err != nil {
		log.Fatal(err)
	}
	if err = tmp.Execute(w, spot.GetAll(db)); err != nil {
		log.Fatal(err)
	}
}

func register(w http.ResponseWriter, r *http.Request){
	tmp, err := template.ParseFiles("templates/layout.gohtml", "templates/register.gohtml")
	if err != nil {
		log.Fatal(err)
	}
	if err = tmp.Execute(w, nil); err != nil {
		log.Fatal(err)
	}
}

var db *hiqdb.HiQDb
var mux *http.ServeMux
var api *hiqapi.ApiMaster

func main(){
	db = hiqdb.New("db/hiqparking.db")
	defer db.Close()

	mux = http.NewServeMux()

	mux.HandleFunc("/", index)
	mux.HandleFunc("/register", register)

	//apispot.Start(db, mux)
	api = hiqapi.Start(db, mux)
	apispot.Register(db, api)
	apiuser.Register(db, api)

	mux.Handle("/public/", http.StripPrefix("/public", http.FileServer(http.Dir("public"))))
	http.ListenAndServe("localhost:8080", mux)

}