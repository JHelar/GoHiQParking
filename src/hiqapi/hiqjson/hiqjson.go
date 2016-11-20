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
	JResponse
	ID int `json:"id"`
	Name string `json:"name"`
	IsParked bool `json:"isparked"`
	ParkedBy string `json:"parkedby,omitempty"`
	CanModify bool `json:"canmodify"`
}

type JSession struct {
	JResponse
	Key string `json:"sessionkey"`
}

type JUser struct {
	JResponse
	ID int `json:"id"`
	UserName string `json:"username"`
	Parked time.Time `json:"parked"`
}

type JResponse struct {
	Error bool `json:"error"`
	Message interface{} `json:"message"`
}

var MAIL_IN_USE_MSG = JResponse{
	Error:true,
	Message:"Email allready in use!",
}

var GENERAL_ERROR_MSG = JResponse{
	Error:true,
	Message:"Something went wrong, try again later!",
}


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
	default:
		err := fmt.Sprintf("HiQJson: Unsupported datatype '%v'", dataVal.Kind())
		log.Printf(err)
		return toJson(JResponse{Error:true,Message:"'message':'"+ err +"'"})
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
	case "JResponse":
		return data
	case "JSpot":
		return data
	case "error":
		return JResponse{Error:true, Message:data.(error).Error()}
	default:
		err := fmt.Sprintf("HiQJson: Unsupported datatype '%v'", dataType.String())
		return fmt.Sprintf("Bad kind of data: %v", err)
	}
}

func toJson(data interface{}) string {
	type Payload struct {
		Data interface{} `json:"data"`
	}
	j, _ := json.MarshalIndent(Payload{Data:data}, "", "")
	return string(j)
}
func sessionToJSession(session session.UserSession) JSession {
	return JSession{Key:session.SessionKey,JResponse:JResponse{Error:false}}
}
func spotToJSpot(spot spot.Spot) JSpot {
	js := JSpot{
		Name:spot.Name,
		IsParked:spot.IsParked,
		JResponse:JResponse{Error:false},

	}
	return js
}
