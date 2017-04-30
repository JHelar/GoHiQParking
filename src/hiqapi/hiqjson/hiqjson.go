package hiqjson

import (
	"reflect"
	"log"
	"encoding/json"
	"fmt"
	"io"
	"hiqdb/session"
	"hiqdb/user"
	"time"
	"hiqdb/spotinfo"
)

type JSpot struct {
	ID int `json:"id"`
	Name string `json:"name"`
	IsParked bool `json:"isparked"`
	ParkedBy string `json:"parkedby,omitempty"`
	ParkedTime time.Time `json:"parkedtime"`
	CanModify bool `json:"canmodify"`
}

type JSession struct {
	Key string `json:"sessionkey"`
}

type JUser struct {
	UserName string `json:"username"`
}

type JResponse struct {
	Error bool `json:"error"`
	Message interface{} `json:"message"`
	Data interface{} `json:"data"`
}

var MAIL_IN_USE_MSG = jsonMust(json.MarshalIndent(JResponse{
	Error:true,
	Message:"Email allready in use!",
},"",""))


var LOGIN_ERROR_MSG = jsonMust(json.MarshalIndent(JResponse{
	Error:true,
	Message:"You need to be logged in.",
},"",""))

var GENERAL_ERROR_MSG = jsonMust(json.MarshalIndent(JResponse{
	Error:true,
	Message:"Something went wrong, try again later!",
},"",""))

var NO_SPOT_INFO_MSG = jsonMust(json.MarshalIndent(JResponse{
	Error:false,
	Message:"Spot has no info",
}, "", ""))

var GENERAL_UPDATE_MSG,_ = json.Marshal(JResponse{
	Error:false,
	Message:"UPDATE",
})

var NO_SPOTS_MSG,_ = json.Marshal(JResponse{
	Error:false,
	Message:"No spots are currently free.",
})

var FREE_SPOT_MSG,_ = json.Marshal(JResponse{
	Error:false,
	Message:"A spot just opened up.",
})


func AsJson(data interface{}) string {
	dataVal := reflect.ValueOf(data)

	switch dataVal.Kind() {
	case reflect.Slice:
		dArr := make([]interface{}, dataVal.Len())
		for i := 0; i < dataVal.Len(); i++ {
			dArr[i] = asJson(dataVal.Index(i).Interface())
		}
		return toJson(dArr)
	case reflect.Struct:
		d := asJson(data)
		return toJson(d)
	case reflect.String:
		return toJson(JResponse{Error:false, Message:data.(string)})
	case reflect.Interface:
		d := asJson(data)
		return toJson(d)
	case reflect.Ptr:
		switch data.(type) {
		case error:
			d := asJson(data)
			return toJson(d)
		default:
			err := fmt.Errorf("HiQJson: Unsupported datatype '%v', data: %+v", dataVal.Kind(), data)
			return toJson(JResponse{Error:true,Message:err.Error()})
		}
	default:
		err := fmt.Errorf("HiQJson: Unsupported datatype '%v', data: %+v", dataVal.Kind(), data)
		return toJson(JResponse{Error:true,Message:err.Error()})
	}
}

func Parse(body io.ReadCloser, receiver interface{}){
	decoder := json.NewDecoder(body)
	defer body.Close()

	err := decoder.Decode(receiver)
	if err != nil {
		log.Panic(err)
	}
}

func asJson(data interface{}) interface{}{
	switch data.(type) {
	case session.UserSession:
		return JSession{Key:data.(session.UserSession).SessionKey}
	case user.User:
		return JUser{UserName:data.(user.User).Username}
	case JResponse:
		return data
	case JSpot:
	case spotinfo.JSpotInfo:
		return data
	case error:
		return JResponse{Error:true, Message:data.(error).Error()}
	default:
		//If nested slice, pass it again.
		if reflect.Slice == reflect.ValueOf(data).Kind(){
			return AsJson(data)
		}else {
			return data
		}
	}
	return nil
}

func toJson(data interface{}) string {
	var resp JResponse
	switch t := data.(type) {
	case JResponse:
		resp = t
	default:
		resp = JResponse{Error:false, Data:t}
	}
	j,_ := json.MarshalIndent(resp,"","")
	return string(j)
}

func jsonMust(data []byte, err error) string{
	if err != nil {
		log.Panic(err)
	}
	return string(data)
}