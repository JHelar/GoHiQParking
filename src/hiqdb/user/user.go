package user

import (
	"hiqdb"
	"time"
	"database/crud"
	"hiqsecurity"
	"fmt"
	"regexp"
)

type User struct {
	ID *int
	Email string
	Username string
	Salt string
	Password string
	Created time.Time
	IsDisabled bool
}

var regMail *regexp.Regexp
const INVALID_LOGIN_MSG = "Invalid email / username or password"

func init(){
	regMail = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
}

func Get(db *hiqdb.HiQDb, user *User) error {
	if crud.Read(db.DB, user, nil, nil) {
		return nil
	}else{
		return fmt.Errorf("No user with id: %d found.", *user.ID)
	}

}

func GetByLogin(db *hiqdb.HiQDb, emailusername, password string) (*User, error) {
	user := User{}

	if regMail.MatchString(emailusername){
		if !crud.Read(db.DB, &user, "Email", emailusername){
			return nil, fmt.Errorf("%v",INVALID_LOGIN_MSG)
		}
	}else{
		if !crud.Read(db.DB, &user, "Username", emailusername){
			return nil, fmt.Errorf("%v",INVALID_LOGIN_MSG)
		}
	}

	if hiqsecurity.CheckIfEqual(user.Salt, user.Password, password) {
		return &user, nil
	}
	return nil, fmt.Errorf("%v",INVALID_LOGIN_MSG)
}

func Create(db *hiqdb.HiQDb, email, username, password string) (*User, error) {
	//If email and username is not in use, continue

	if !crud.Read(db.DB, &User{}, "Email", email) {
		if !crud.Read(db.DB, &User{}, "Username", username) {
			salt, saltedPassword := hiqsecurity.NewSaltedPassword(password)
			user := User{
				ID:nil,
				Email:email,
				Username:username,
				Salt:salt,
				Password:saltedPassword,
				Created:time.Now(),
			}
			if crud.Create(db.DB, &user) {
				if crud.Read(db.DB, &user, "Email", user.Email) {
					return &user, nil
				} else {
					return nil, fmt.Errorf("Something went wrong try again later.")
				}
			} else {
				return nil, fmt.Errorf("Something went wrong try again later.")
			}
		}else{
			return nil, fmt.Errorf("The username is allready in use.")
		}
	}else{
		return nil, fmt.Errorf("The email is allready in use.")
	}
}
