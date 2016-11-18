package hiqjson

import (
	"time"
	"reflect"
	"hiqdb/spot"
	"log"
	"encoding/json"
	"fmt"
	"io"
	"hiqdb/session"
)

type JSpot struct {
	ID   int `json:"id"`
	Name string `json:"name"`
	IsParked bool `json:"isparked"`
	ParkedBy JUser `json:"parkedby,omitempty"`
}

type JSession struct {
	Key string `json:"sessionkey"`
}

type JUser struct {
	ID int `json:"id"`
	UserName string `json:"username"`
	Parked time.Time `json:"parked"`
}

const GENERAL_ERROR_MSG = "{'error':true,'message':'Something went wrong, try again later!'}"
const MAIL_IN_USE_MSG = "{'error':true,'message':'Email allready in user!'}"

func AsJson(data interface{}) string {
	dataVal := reflect.ValueOf(data)

	switch dataVal.Kind() {
	case reflect.Slice:
		dArr := make([]interface{}, dataVal.Len())
		for i := 0; i < dataVal.Len(); i++ {
			dArr[i] = asJson(dataVal.Index(i).Interface())
		}
		return toJson(true, dArr)
	case reflect.Struct:
		d := asJson(data)
		return toJson(true, d)
	case reflect.String:
		return toJson(false, data)
	default:
		err := fmt.Sprintf("HiQJson: Unsupported datatype '%v'", dataVal.Kind())
		log.Printf(err)
		return toJson(false, "'message':'"+ err +"'")
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
	dataType := reflect.TypeOf(data)
	switch dataType.Name() {
	case "Spot":
		return spotToJSpot(data.(spot.Spot))
	case "UserSession":
		return sessionToJSession(data.(session.UserSession))
	default:
		err := fmt.Sprintf("HiQJson: Unsupported datatype '%v'", dataType.String())
		return fmt.Sprintf("Bad kind of data: %v", err)
	}
}

func toJson(success bool , data interface{}) string {
	type Payload struct {
		Success bool `json:"success"`
		Data interface{} `json:"data"`
	}
	j, _ := json.MarshalIndent(Payload{Success:success,Data:data}, "", "")
	return string(j)
}
func sessionToJSession(session session.UserSession) JSession {
	return JSession{Key:session.SessionKey}
}
func spotToJSpot(spot spot.Spot) JSpot {
	js := JSpot{
		ID:spot.ID,
		Name:spot.Name,
		IsParked:spot.IsParked,
	}
	if js.IsParked {
		//TODO: INSERT USER.
	}
	return js
}
