package spot

import (
	"hiqdb"
	"database/crud"
	"fmt"
	"time"
	"log"
	"hiqdb/user"
)

type Spot struct {
	hiqdb.HiQTable `crud:"ignore" json:"-"`
	ID int `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
	IsParked bool `json:"isparked"`
	ParkedBy int `json:"parkedby, omitempty"`
	ParkedTime time.Time `json:"parkedtime, omitempty"`
	ParkingLot int `json:"parkinglot"`
}

type JSpot struct {
	ID int `json:"id"`
	Name string `json:"name"`
	IsParked bool `json:"isparked"`
	ParkedBy string `json:"parkedby"`
	ParkedTime time.Time `json:"parkedtime"`
	CanModify bool `json:"canmodify"`
}

func (s *Spot) AsJson(db *hiqdb.HiQDb) interface{}{
	data := JSpot{ID:s.ID, Name:s.Name, IsParked:s.IsParked,CanModify:false}
	if s.IsParked{
		usr := user.User{ID:&s.ParkedBy}
		if err := user.Get(db, &usr); err == nil {
			data.ParkedBy = usr.Username
			data.ParkedTime = s.ParkedTime
		}else{
			log.Printf("%v", err)
		}
	}
	return data
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

func GetAllByLotID(db *hiqdb.HiQDb, id int) []Spot{
	if spotsI, ok := crud.ReadAll(db.DB, &Spot{},"ParkingLot",id); ok {
		spots := make([]Spot, len(spotsI))
		for i,_ := range spotsI {
			spots[i] = spotsI[i].(Spot)
		}
		return spots
	}else{
		return nil
	}
}

func GetFreeSpots(db *hiqdb.HiQDb, parkingLot int) []Spot {
	if spotsI, ok := crud.ReadAll(db.DB, &Spot{},"IsParked",0); ok {
		spots := make([]Spot, 0)
		for i,_ := range spotsI {
			s := spotsI[i].(Spot)
			if s.ParkingLot == parkingLot{
				spots = append(spots, spotsI[i].(Spot))
			}
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