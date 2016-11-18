package user

import (
	"hiqdb"
	"time"
	"database/crud"
	"log"
	"hiqsecurity"
)

type User struct {
	ID int
	Email string
	Username string
	Salt string
	Password string
	Created time.Time
	IsDisabled bool
}

func Get(db *hiqdb.HiQDb, user *User) bool {
	return crud.Read(db.DB, user, nil, nil)
}

func GetByLogin(db *hiqdb.HiQDb, email, password string) (*User, bool) {
	user := User{}

	if ok := crud.Read(db.DB, &user, "Email", email); ok {
		if hiqsecurity.CheckIfEqual(user.Salt, user.Password, password) {
			return &user, true
		}
	}
	return &user, false
}

func Create(db *hiqdb.HiQDb, email, username, password string) (*User, bool) {
	//If email is not in use, continue
	if ok := crud.Read(db.DB, &User{Email:email}, "Email", email); !ok{
		salt, saltedPassword := hiqsecurity.NewSaltedPassword(password)
		user := User{
			Email:email,
			Username:username,
			Salt:salt,
			Password:saltedPassword,
		}
		if ok = crud.Create(db.DB, &user); ok {
			ok = crud.Read(db.DB, &user, "Email", user.Email)
			return &user, ok
		}
	}else{
		log.Printf("Mail is allready in user: %v", email)
	}
	return nil, false
}
