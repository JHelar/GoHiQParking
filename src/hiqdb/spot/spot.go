package spot

import (
	"hiqdb"
	"database/crud"
	"fmt"
)

type Spot struct {
	ID int `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
	IsParked bool `json:"isparked,omitempty"`
	ParkedBy int `json:"parkedby, omitempty"`
}

func GetAll(db *hiqdb.HiQDb) []Spot {
	if spotsI, ok := crud.ReadAll(db.DB, &Spot{}); ok {
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