/**
 * Created by Johnh on 2017-04-29.
 */
import fetch from 'isomorphic-fetch';

const GET_LOTS_PATH = "api/lot/getAll";
const LOT_FILL_PATH = "api/lot/fill";
const SPOT_TOGGLE_PATH = "api/spot/toggle";
const GET_USER_PATH = "api/user/get";
const LOGIN_USER_PATH = "api/user/login";
const REGISTER_USER_PATH = "api/user/register";
const LOGOUT_USER_PATH = "api/user/logout";
const SPOT_EVENT_PATH = "/event/spot";

const eventSource = new EventSource(SPOT_EVENT_PATH);
const updateLotName = null;
const event = {
    addListener: (name, success, error) => {
        eventSource.addEventListener(name, (e) => {
           let data = JSON.parse(e.data);
           if(!data.error)
               success(data);
           else{
               error(data);
           }
        }, false);
    },
    removeListener: (name) => {
        eventSource.removeEventListener(name);
    }
};

const Client = {
    getLots: () => {
        return get(GET_LOTS_PATH);
    },
    fillLot: (lotId, sessionKey) => {
        return post(LOT_FILL_PATH, {id: lotId, sessionKey: sessionKey});
    },
    toggleSpot: (spotId, sessionKey) => {
        return post(SPOT_TOGGLE_PATH, {id: spotId, sessionKey: sessionKey});
    },
    getUser: (sessionKey) => {
        return post(GET_USER_PATH, {sessionKey: sessionKey});
    },
    logIn: (usernameEmail, password) => {
        return post(LOGIN_USER_PATH, {usernameemail: usernameEmail, password: password});
    },
    register: (username, email, password) => {
        return post(REGISTER_USER_PATH, {username: username, email: email, password: password});
    },
    logOut: (sessionKey) => {
        return post(LOGOUT_USER_PATH, {sessionKey: sessionKey});
    },
    updateLotListener: (lotId, success, error) => {
        const newName = "update" + lotId.toString();
        if(updateLotName === null){
            event.addListener(newName, success, error);
        } else if(updateLotName !== newName){
            event.removeListener(updateLotName);
            event.addListener(newName, success, error);
        }
    }
};

export default Client;

const post = (url, body) => {
  return fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
  });
};

const get = (url) => {
  return fetch(url);
};