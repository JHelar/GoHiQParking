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

func (db *HiQDb) MustPrepare(query string) *sql.Stmt {
	stmt, err := db.Prepare(query)
	if err != nil {
		log.Panic(err)
		return nil
	}
	return stmt
}

func (db *HiQDb) MustQuery(query string, args ...interface{}) *sql.Rows{
	var rows *sql.Rows
	var err error
	if len(args) > 0 {
		rows, err = db.Query(query, args...)
	}else{
		rows, err = db.Query(query)
	}
	if err != nil {
		log.Fatal(err)
	}
	return rows
}

func (db HiQDb) MustQueryRow(query string, args ...interface{}) *sql.Row {
	var row *sql.Row
	if len(args) > 0{
		row = db.QueryRow(query, args...)
	}else{
		row = db.QueryRow(query)
	}
	return row
}

func New(dbSource string) *HiQDb {
	database, err := sql.Open("sqlite3", dbSource)
	if err != nil {
		log.Fatal(err)
	}
	flareLog("database is connected.")
	return &HiQDb{database}
}
