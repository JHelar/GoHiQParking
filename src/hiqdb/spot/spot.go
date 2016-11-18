package spot

import (
	"hiqdb"
	"database/crud"
)

type Spot struct {
	ID int
	Name string
	IsParked bool
	ParkedBy int
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

func Update(db *hiqdb.HiQDb,spot Spot) bool {
	return crud.Update(db.DB, &spot)
}