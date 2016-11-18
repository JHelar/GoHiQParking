package session

import (
	"time"
	"hiqdb"
	"database/crud"
	"hiqsecurity"
)

type UserSession struct {
	SessionKey string
	UserID int
	LoginTime time.Time
	LastSeenTime time.Time
}

func Get(db *hiqdb.HiQDb, session *UserSession) bool {
	return crud.Read(db.DB, session, nil, nil)
}

func Delete(db *hiqdb.HiQDb, session *UserSession) bool {
	return crud.Delete(db.DB, session)
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