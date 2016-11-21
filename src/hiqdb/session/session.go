package session

import (
	"time"
	"hiqdb"
	"database/crud"
	"hiqsecurity"
	"fmt"
)

type UserSession struct {
	SessionKey string
	UserID int
	LoginTime time.Time
	LastSeenTime time.Time
}

func Get(db *hiqdb.HiQDb, session *UserSession) error {
	if crud.Read(db.DB, session, nil, nil) {
		return nil
	}else {
		return fmt.Errorf("No usersession found with that key.")
	}
}

func GetByUserID(db *hiqdb.HiQDb, userID int) (*UserSession, error) {
	ses := UserSession{}
	if crud.Read(db.DB, &ses, "UserID", userID){
		return &ses, nil
	}else{
		return nil, fmt.Errorf("No usersession with that userID.")
	}
}

func Delete(db *hiqdb.HiQDb, session *UserSession) error {
	if crud.Delete(db.DB, session){
		return nil
	}
	return fmt.Errorf("Something went badly in usersession delete.")
}


func NewUserSession(db *hiqdb.HiQDb, userID int) (*UserSession, bool) {
	session := UserSession{}
	var ok bool

	if ok = crud.Read(db.DB, &session, "UserID", userID); !ok{
		//Create new session
		session.UserID = userID
		session.SessionKey = hiqsecurity.GenerateSessionKey()
		session.LastSeenTime = time.Now()
		session.LoginTime = time.Now()

		ok = crud.Create(db.DB, &session)
	}else {
		//Update existing session.
		session.LastSeenTime = time.Now()
		session.LoginTime = time.Now()
		ok = crud.Update(db.DB, &session)
	}
	return &session, ok
}