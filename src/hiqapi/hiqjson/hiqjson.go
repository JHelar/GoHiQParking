package hiqjson

import (
	"reflect"
	"hiqdb/spot"
	"log"
	"encoding/json"
	"fmt"
	"io"
	"hiqdb/session"
	"hiqdb/user"
	"time"
)

type JSpot struct {
	JResponse
	ID int `json:"id"`
	Name string `json:"name"`
	IsParked bool `json:"isparked"`
	ParkedBy string `json:"parkedby,omitempty"`
	ParkedTime time.Time `json:"parkedtime"`
	CanModify bool `json:"canmodify"`
}

type JSession struct {
	JResponse
	Key string `json:"sessionkey"`
}

type JUser struct {
	JResponse
	UserName string `json:"username"`
}

type JResponse struct {
	Error bool `json:"error"`
	Message interface{} `json:"message"`
}

var MAIL_IN_USE_MSG = JResponse{
	Error:true,
	Message:"Email allready in use!",
}

var LOGIN_ERROR_MSG = JResponse{
	Error:true,
	Message:"You need to be logged in.",
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
	switch t := data.(type) {
	case spot.Spot:
		return spotToJSpot(data.(spot.Spot))
	case session.UserSession:
		return sessionToJSession(data.(session.UserSession))
	case user.User:
		return JUser{JResponse:JResponse{Error:false, Message:""}, UserName:data.(user.User).Username}
	case JResponse:
		return data
	case JSpot:
		return data
	case error:
		return JResponse{Error:true, Message:data.(error).Error()}
	default:
		err := fmt.Sprintf("HiQJson: Unsupported datatype '%v'", t)
		log.Print(err)
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
