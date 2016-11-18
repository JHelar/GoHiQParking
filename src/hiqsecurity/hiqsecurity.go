package hiqsecurity

import (
	"math/rand"
	"time"
	"crypto/sha512"
	"encoding/hex"
	"log"
	"net/http"
	"encoding/base64"
)

const saltSymols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZåäöÅÄÖ!#¤%&/()=?"


func makeSaltString() string{
	rand.Seed(time.Now().UnixNano())
	b := make([]byte, len(saltSymols))
	for i := range b {
		b[i] = saltSymols[rand.Intn(len(saltSymols))]
	}
	return string(b)
}


//Function returns a salt and the salted and hashed password
func NewSaltedPassword(password string)(string, string) {
	salt := makeSaltString()
	hasher := sha512.New()

	//hash the salt with the password.
	hasher.Write([]byte(salt + password))
	saltedPass := hex.EncodeToString(hasher.Sum(nil))

	return salt, saltedPass
}

//Checks if given password matches the salted password when salted it self.
func CheckIfEqual(salt, saltedPassword, password string) bool {
	hasher := sha512.New()

	hasher.Write([]byte(salt + password))
	//Create a salted hashed pass with the given password.
	return hex.EncodeToString(hasher.Sum(nil)) == saltedPassword
}

func GenerateSessionKey() string{
	key := make([]byte, 64)
	_, err := rand.Read(key)
	if err != nil{
		log.Print(err)
	}
	return base64.StdEncoding.EncodeToString(key)
}

//Resturns empty string if cookie not found.
func GetSessionKeyFromHeader(r *http.Request)  string {
	session, err := r.Cookie("SessionKey")
	if err != nil {
		return ""
	}
	str := session.String()
	return str[11:len(str)]
}
