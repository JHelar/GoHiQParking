package main

import (
	"hiqdb"
	"log"
	"net/http"
	"text/template"
	"hiqapi"
	"hiqapi/apispot"
	"hiqapi/apiuser"
	"hiqapi/apilot"
	"github.com/kabukky/httpscerts"
)

func index(w http.ResponseWriter, r *http.Request){
	tmp, err := template.ParseFiles("templates/layout.gohtml", "templates/home.gohtml")
	if err != nil {
		log.Fatal(err)
	}
	if err = tmp.Execute(w, nil); err != nil {
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

func login(w http.ResponseWriter, r *http.Request){
	tmp, err := template.ParseFiles("templates/layout.gohtml", "templates/login.gohtml")
	if err != nil {
		log.Fatal(err)
	}
	if err = tmp.Execute(w, nil); err != nil {
		log.Fatal(err)
	}
}

func redirectToHttps(w http.ResponseWriter, r *http.Request) {
	// Redirect the incoming HTTP request. Note that "127.0.0.1:8081" will only work if you are accessing the server from your local machine.
	http.Redirect(w, r, "0.0.0.0:8080"+r.RequestURI, http.StatusMovedPermanently)
}

var db *hiqdb.HiQDb
var mux *http.ServeMux
var api *hiqapi.ApiMaster

func main(){
	// Generate https certs
	err := httpscerts.Check("cert.pem", "key.pem")
	if err != nil {
		err = httpscerts.Generate("cert.pem", "key.pem", "0.0.0.0:8080")
		if err != nil {
			log.Fatal("Error: coud not create https certs.")
		}
	}

	db = hiqdb.New("db/hiqparking.db")
	defer db.Close()

	mux = http.NewServeMux()
	mux.HandleFunc("/", index)
	mux.HandleFunc("/register", register)
	mux.HandleFunc("/login", login)

	//apispot.Start(db, mux)
	api = hiqapi.Start(db, mux)
	lotApi := apilot.New()
	lotApi.Register(api, db)

	apispot.Register(db, api)
	apiuser.Register(db, api)

	mux.Handle("/public/", http.StripPrefix("/public", http.FileServer(http.Dir("public"))))
	http.ListenAndServeTLS("0.0.0.0:8080", "cert.pem", "key.pem", mux)

}