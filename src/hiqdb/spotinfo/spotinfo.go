package spotinfo

import (
	"hiqdb"
	"database/crud"
	"fmt"
)

type SpotInfo struct {
	hiqdb.HiQTable `crud:"ignore" json:"-"`
	ID int `json:"id,omitempty"`
	SpotID int `json:"spotid"`
	Description string `json:"description"`
	Longitude float64 `json:"long"`
	Latitude float64 `json:"lat"`
	ImagePath string `json:"imagepath,omitempty"`
}

type JSpotInfo struct {
	SpotId int `json:"spotid"`
	Description string `json:"description"`
	Longitude float64 `json:"long"`
	Latitude float64 `json:"lat"`
	ImagePath string `json:"imagepath,omitempty"`
}

func (si *SpotInfo) AsJson() interface{}{
	return JSpotInfo{SpotId:si.SpotID, Description:si.Description, ImagePath:si.ImagePath, Latitude:si.Latitude, Longitude:si.Longitude}
}

func Get(db *hiqdb.HiQDb, spotInfo *SpotInfo) bool {
	return crud.Read(db.DB, spotInfo, nil, nil)
}

func GetBySpotID(db *hiqdb.HiQDb, spotID int) (*SpotInfo, error) {
	spotInfo := SpotInfo{}
	if ok := crud.Read(db.DB, &spotInfo, "SpotID", spotID); ok {
		return &spotInfo, nil
	}
	return nil, fmt.Errorf("No information found for given spot.")
}
