package spot

import (
	"hiqdb"
	"database/crud"
	"fmt"
	"time"
)

type Spot struct {
	ID int `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
	IsParked bool `json:"isparked,omitempty"`
	ParkedBy int `json:"parkedby, omitempty"`
	ParkedTime time.Time `json:"parkedtime, omitempty"`
}

func GetAll(db *hiqdb.HiQDb) []Spot {
	if spotsI, ok := crud.ReadAll(db.DB, &Spot{},nil,nil); ok {
		spots := make([]Spot, len(spotsI))
		for i,_ := range spotsI {
			spots[i] = spotsI[i].(Spot)
		}
		return spots
	}else{
		return nil
	}
}

func GetFreeSpots(db *hiqdb.HiQDb) []Spot {
	if spotsI, ok := crud.ReadAll(db.DB, &Spot{},"IsParked",0); ok {
		spots := make([]Spot, len(spotsI))
		for i,_ := range spotsI {
			spots[i] = spotsI[i].(Spot)
		}
		return spots
	}else{
		return nil
	}
}

func Get(db *hiqdb.HiQDb, spot *Spot) bool {
	return crud.Read(db.DB, spot, nil, nil)
}

func GetByUserID(db *hiqdb.HiQDb, userID int) (*Spot, error) {
	spot := Spot{}
	if ok := crud.Read(db.DB, &spot, "ParkedBy", userID); ok {
		return &spot, nil
	}
	return nil, fmt.Errorf("No spot is parked by that userID")
}

func Update(db *hiqdb.HiQDb,spot Spot) bool {
	return crud.Update(db.DB, &spot)
}