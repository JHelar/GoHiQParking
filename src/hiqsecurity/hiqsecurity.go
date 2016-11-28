package hiqsecurity

import (
	"math/rand"
	"time"
	"crypto/sha512"
	"encoding/hex"
	"log"
	"net/http"
	"encoding/base64"
	"fmt"
	"encoding/json"
	"io/ioutil"
	"bytes"
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

//Resturns empty string if cookie not found or no json.
func GetSessionKeyFromRequest(r *http.Request)  (string, error) {
	session, err := r.Cookie("skey")
	if err != nil {
		//Try get the sessionkey from json.
		//We need to read and copy the bytes in the readcloser. In order to put the read head back to the start.
		var bufferBytes []byte
		bufferBytes, _ = ioutil.ReadAll(r.Body)
		r.Body = ioutil.NopCloser(bytes.NewBuffer(bufferBytes))

		bodyCpy := ioutil.NopCloser(bytes.NewBuffer(bufferBytes))
		defer bodyCpy.Close()

		decoder := json.NewDecoder(bodyCpy)
		var data struct{
			SessionKey string `json:"sessionKey"`
		}
		err = decoder.Decode(&data)
		if err != nil {
			return "", fmt.Errorf("No session key found")
		}else{
			return data.SessionKey, nil
		}
	}
	str := session.String()
	return str[5:len(str)], nil
}
