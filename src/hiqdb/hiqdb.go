package hiqdb

import (
	"database/sql"
	"log"
	_"github.com/mattn/go-sqlite3"
)

const FLARE = "HiQDatabase: "
//Method holder interface
type HiQDb struct {
	*sql.DB
}

func flareLog(args ...interface{}){
	log.Printf("%v%+v",FLARE, args)
}
func (db *HiQDb) MustPing() bool {
	err := db.Ping()
	if err != nil {
		flareLog(err)
		return false
	}
	flareLog("is active!")
	return true
}

func (db *HiQDb) MustClose() {
	flareLog("Closing...")
	err := db.Close()
	if err != nil{
		flareLog(err)
	}
	flareLog("Closed")
}

func New(dbSource string) *HiQDb {
	database, err := sql.Open("sqlite3", dbSource)
	if err != nil {
		log.Fatal(err)
	}
	flareLog("database is connected.")
	return &HiQDb{database}
}
