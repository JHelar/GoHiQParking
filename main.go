package main

import (
	"hiqdb"
	"hiqdb/spot"
	"log"
	"hiqdb/crud"
)

var db *hiqdb.HiQDb

func main(){
	db = hiqdb.New("db/hiqparking.db")
	log.Print(db.MustPing())

	if data, ok := crud.ReadAll(db.DB, &spot.Spot{}); ok {
		for _,d := range data{
			log.Printf("Read all: %+v", d)
		}

	}else{
		log.Print("Not good!")
	}
}