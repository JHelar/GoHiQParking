package main

import (
	"hiqapi"
	"hiqapi/apilot"
	"hiqapi/apispot"
	"hiqapi/apiuser"
	"hiqdb"
	"log"
	"net/http"
	"text/template"
)

func index(w http.ResponseWriter, r *http.Request) {
	tmp, err := template.ParseFiles("templates/layout.gohtml", "templates/home.gohtml")
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

func main() {
	// Generate https certs
	// err := httpscerts.Check("cert.pem", "key.pem")
	// if err != nil {
	// 	err = httpscerts.Generate("cert.pem", "key.pem", "0.0.0.0:8080")
	// 	if err != nil {
	// 		log.Fatal("Error: coud not create https certs.")
	// 	}
	// }

	db = hiqdb.New("db/hiqparking.db")
	defer db.Close()

	mux = http.NewServeMux()
	mux.HandleFunc("/", index)

	//apispot.Start(db, mux)
	api = hiqapi.Start(db, mux)
	apilot := apilot.New()
	apilot.Register(api, db)

	apispot.Register(db, api)
	apiuser.Register(db, api)

	// Seed the db

	mux.Handle("/public/", http.StripPrefix("/public", http.FileServer(http.Dir("public"))))
	http.ListenAndServe("0.0.0.0:8080", mux)
}
