package parkinglot

import (
	"hiqdb"
	"database/crud"
	"hiqdb/spot"
	"fmt"
)

type ParkingLot struct {
	ID int `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
	Location string `json:"location,omitempty"`
	Spots []spot.Spot `crud:"ignore" json:"spots,omitempty"`
}

func Create(db *hiqdb.HiQDb, name, location string) (*ParkingLot, bool) {
	parkingLot := ParkingLot{Name:name, Location:location}

	if ok := crud.Create(db.DB, &parkingLot); ok{
		return &parkingLot, true
	}else{
		return nil, ok
	}
}

func GetAll(db *hiqdb.HiQDb, setSpots bool) ([]ParkingLot, error){
	if lotsI, ok := crud.ReadAll(db.DB, &ParkingLot{},nil,nil); ok {
		lots := make([]ParkingLot, len(lotsI))
		var err error

		for i,_ := range lotsI{
			lots[i] = lotsI[i].(ParkingLot)
			//Set all the parking spots for the lot.
			if setSpots {
				err = SetSpots(db, &lots[i])
			}
		}
		if err != nil {
			return nil, err
		}
		return lots, nil
	}else{
		return nil, fmt.Errorf("Could not retrive parkinglots")
	}
}

func SetSpots(db *hiqdb.HiQDb, lot *ParkingLot) error {
	if spotsI, ok := crud.ReadAll(db.DB, &spot.Spot{},"ParkingLot",lot.ID); ok {
		spots := make([]spot.Spot, len(spotsI))
		for i,_ := range spotsI {
			spots[i] = spotsI[i].(spot.Spot)
		}
		lot.Spots = spots
		return nil
	}else{
		return fmt.Errorf("Could not retrive spots for lot %v", lot.Name)
	}
}