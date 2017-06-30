import { createCookie, getCookie, deleteCookie } from '../../../general/helpers';
import { SCENE } from './constants';
import Client from '../../../general/ApiClient';
import GeoClient from '../../../general/GeoClient';
import configure from '../containers/Root';

// API ACTIONS
// Get parking lots
export const FETCH_PARKING_LOTS_REQUEST = 'FETCH_PARKING_LOTS_REQUEST';
export const FETCH_PARKING_LOTS_SUCCESS = 'FETCH_PARKING_LOTS_SUCCESS';
export const FETCH_PARKING_LOTS_ERROR = 'FETCH_PARKING_LOTS_ERROR';

export const FETCH_SPOTS_REQUEST = 'FETCH_SPOTS_REQUEST';
export const FETCH_SPOTS_SUCCESS = 'FETCH_SPOTS_SUCCESS';
export const FETCH_SPOTS_ERROR = 'FETCH_SPOTS_ERROR';

export const FETCH_SPOT_INFO_REQUEST = 'FETCH_SPOT_INFO_REQUEST';
export const FETCH_SPOT_INFO_SUCCESS = 'FETCH_SPOT_INFO_SUCCESS';
export const FETCH_SPOT_INFO_ERROR = 'FETCH_SPOT_INFO_ERROR';

export const FETCH_TOGGLE_SPOT_REQUEST = 'FETCH_TOGGLE_SPOT_REQUEST';
export const FETCH_TOGGLE_SPOT_SUCCESS = 'FETCH_TOGGLE_SPOT_SUCCESS';
export const FETCH_TOGGLE_SPOT_ERROR = 'FETCH_TOGGLE_SPOT_ERROR';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_ERROR = 'REGISTER_ERROR';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';

export const SHOW_PARKING_LOTS = 'SHOW_PARKING_LOTS';
export const SELECT_PARKING_LOT = 'SELECT_PARKING_LOT';
export const TOGGLE_SPOT = 'TOGGLE_SPOT';
export const CHANGE_SCENE = 'CHANGE_SCENE';
export const TOGGLE_MENU = 'TOGGLE_MENU';
export const HIDE_SPOT_INFO = 'HIDE_SPOT_INFO';
export const SHOW_SPOT_INFO = 'SHOW_SPOT_INFO';
export const GEOLOCATION_SETUP = 'GEOLOCATION_SETUP';
export const UPDATE_SPOT_DISTANCE = 'UPDATE_SPOT_DISTANCE';
export const SET_SPOT_INTERVAL = 'SET_SPOT_INTERVAL';
export const REMOVE_SPOT_INTERVAL = 'REMOVE_SPOT_INTERVAL';

export function requestParkingLots() {
	return {
		type: FETCH_PARKING_LOTS_REQUEST
	};
}

export function receiveParkingLots(json){
	return {
		type: FETCH_PARKING_LOTS_SUCCESS,
		parking_lots: json.data,
		received_at: Date.now()
	};
}

export function receiveParkingLotsError(json) {
	return {
		type: FETCH_PARKING_LOTS_ERROR,
		error_msg: json.message
	};
}

export function fetchParkingLots(){
	return dispatch => {
		dispatch(requestParkingLots());
		return Client.getLots()
			.then(response => response.json())
			.then(json => {
				if(json.error) dispatch(receiveParkingLotsError(json));
				else dispatch(receiveParkingLots(json));
			})
			.catch(function(ex) {
                dispatch(receiveParkingLotsError({ message: "Exception: " + ex }));
			});
	};
}

// Get spots
export function requestSpots(parkingLot){
	return {
		type: FETCH_SPOTS_REQUEST,
		parkingLot
	};
}

export function receiveSpots(parkingLot, json) {
	return {
		type: FETCH_SPOTS_SUCCESS,
		spots: json.data.spots,
		received_at: Date.now(),
		parkingLot
	}
}

export function receiveSpotsError(parkingLot, json) {
	return {
		type: FETCH_SPOTS_ERROR,
		error_msg: json.message,
		parkingLot
	};
}

export function fetchSpots(parkingLot) {
	return dispatch => {
		dispatch(requestSpots(parkingLot));
		return Client.fillLot(parkingLot, getCookie("skey"))
			.then(response => response.json())
			.then(json => {
				if(json.error) dispatch(receiveSpotsError(parkingLot, json));
				else{
				    dispatch(receiveSpots(parkingLot, json));
				}
			})
            .catch(function(ex) {
                dispatch(receiveSpotsError(parkingLot, { message: "Exception: " + ex }));
            });
	};
}

// SPOT INFO
export function requestSpotInfo(spotId){
    return {
        type: FETCH_SPOT_INFO_REQUEST,
        spotId
    };
}

export function receiveSpotInfo(spotId, json) {
    return {
        type: FETCH_SPOT_INFO_SUCCESS,
        spotinfo: json.data,
        received_at: Date.now(),
        spotId
    }
}

export function receiveSpotInfoError(spotId, json) {
    return {
        type: FETCH_SPOT_INFO_ERROR,
        error_msg: json.message,
        spotId
    };
}

export function fetchSpotInfo(spotId) {
    return dispatch => {
        dispatch(requestSpotInfo(spotId));
        return Client.spotInfo(spotId)
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(receiveSpotInfoError(spotId, json));
                else dispatch(receiveSpotInfo(spotId, json));
            })
            .catch((ex) => {
                dispatch(receiveSpotInfoError(spotId, { message: "Exception: " + ex}));
            })
    }
}

// POST Toggle
export function requestToggleSpot(spot) {
	return {
		type: FETCH_TOGGLE_SPOT_REQUEST,
		spot
	}
}

export function receiveToggleSpot(spot, json){
	return {
		type: FETCH_TOGGLE_SPOT_SUCCESS,
        spot: json.data.filter(s => s.id === spot)[0],
		received_at: Date.now()
	}
}

export function receiveToggleSpotError(spot, json) {
	return {
		type: FETCH_TOGGLE_SPOT_ERROR,
		spot,
		error_msg: json.message
	}
}

export function fetchToggleSpot(spot){
	return dispatch => {
		dispatch(requestToggleSpot(spot));
		return Client.toggleSpot(spot, getCookie("skey"))
			.then(response => response.json())
			.then(json => {
				if(json.error) dispatch(receiveToggleSpotError(spot, json));
				else dispatch(receiveToggleSpot(spot, json));
			})
            .catch(function(ex) {
                dispatch(receiveParkingLotsError({ message: "Exception: " + ex }));
            });
	};
}

// POST Login
export function requestLogin() {
    return {
        type: LOGIN_REQUEST
    }
}

export function receiveLogin(json) {
    return {
        type: LOGIN_SUCCESS,
        user: json.data
    }
}

export function receiveLoginError(json) {
    return {
        type: LOGIN_ERROR,
        error_msg: json.message
    }
}

export function fetchUser(dispatchCallback) {
    return dispatch => {
        return Client.getUser(getCookie("skey"))
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(receiveLoginError(json));
                else {
                    dispatch(dispatchCallback(json));
                }
            })
            .catch(function (ex) {
                dispatch(receiveLoginError({message: "fetchUser: " + ex}));
            })
    };
}

export function setDefaultScene(){
    return dispatch => {
        let dlot = parseInt(getCookie("dlot")) | 0;
        console.log("Default lot: ", dlot);
        if(dlot !== undefined && dlot !== null && dlot > 0){
            dispatch(selectParkingLot(dlot));
            dispatch(fetchSpots(dlot));
            dispatch(updateLotListener(dlot));
            dispatch(changeScene(SCENE.SHOW_SPOTS));
        }
        else{
            dispatch(changeScene(SCENE.SHOW_PARKING_LOTS));
        }
    };
}

export function fetchLogin(usernameemail, password) {
    return dispatch => {
        dispatch(requestLogin());
        return Client.logIn(usernameemail, password)
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(receiveLoginError(json));
                else {
                    createCookie("skey", json.data.sessionkey, 360);
                    dispatch(fetchUser(receiveLogin));
                    dispatch(setDefaultScene());
                }
            })
            .catch(function(ex) {
                dispatch(receiveLoginError({ message: "fetchLogin: " + ex }));
            });

    };
}

// POST Register
export function requestRegister() {
    return {
        type: REGISTER_REQUEST
    };
}

export function receiveRegister(json) {
    return {
        type: REGISTER_SUCCESS,
        user: json.data
    }
}

export function receiveRegisterError(json) {
    return {
        type: REGISTER_ERROR,
        error_msg: json.message
    }
}
export function fetchRegister(username, email, password) {
    return dispatch => {
        dispatch(requestRegister());
        return Client.register(username, email, password)
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(receiveRegisterError(json));
                else {
                    createCookie("skey", json.data.sessionkey, 360);
                    dispatch(fetchUser(receiveRegister));
                    dispatch(setDefaultScene());
                }
            })
            .catch(function(ex) {
                dispatch(receiveRegisterError({ message: "fetchRegister: " + ex }));
            });

    };
}
// POST Logout
export function requestLogout() {
    return {
        type: LOGOUT_REQUEST
    };
}

export function receiveLogout(json) {
    return {
        type: LOGOUT_SUCCESS
    }
}

export function receiveLogoutError(json) {
    return {
        type: LOGOUT_ERROR,
        error_msg: json.message
    }
}

export function fetchLogout() {
    return dispatch => {
        dispatch(requestLogout());
        return Client.logOut(getCookie("skey"))
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(receiveLogoutError(json));
                else {
                    deleteCookie("skey");
                    dispatch(receiveLogout(json));
                    dispatch(changeScene(SCENE.SHOW_PARKING_LOTS));
                }
            })
            .catch(function(ex) {
                dispatch(receiveLogoutError({ message: "fetchLogout: " + ex }));
            });

    };
}

// USER ACTIONS
export function showParkingLots() {
	return {
		type: SHOW_PARKING_LOTS
	};
}

export function selectParkingLot(parkingLot) {
	return {
		type: SELECT_PARKING_LOT,
		parkingLot
	};
}

export function toggleSpot(spot) {
	return {
		type: TOGGLE_SPOT,
		spot
	};
}

export function changeScene(scene) {
	return {
		type: CHANGE_SCENE,
		scene
	};
}

export function toggleMenu() {
    return {
        type: TOGGLE_MENU
    }
}

export function showSpotInfo(spotId) {
    return {
        type: SHOW_SPOT_INFO,
        spotId: spotId
    }
}

export function hideSpotInfo() {
    return {
        type: HIDE_SPOT_INFO
    }
}

// UPDATE LISTENER
export function updateLotListener(parkingLot) {
    return dispatch => {
        return Client.updateLotListener(parkingLot,
            () => dispatch(fetchSpots(parkingLot)),
            () => dispatch(receiveSpotsError(parkingLot, {message: "EventStreamError"}))
        )
    }
}

export function geoLocationSetUp(dist) {
    return {
        type: GEOLOCATION_SETUP,
        canGeoPoll: dist > -1
    };
}

export function updateSpotDistance(id, dist) {
    return {
        type: UPDATE_SPOT_DISTANCE,
        distance: dist,
        spotId: id
    };
}

export function setSpotInterval(id, intervalId) {
    return {
        type: SET_SPOT_INTERVAL,
        intervalId: intervalId,
        spotId: id
    };
}

export function setupSpotInterval(id, pos) {
    return dispatch => {
        let intId = setInterval(() => GeoClient.getDistance(pos, (dist) => dispatch(updateSpotDistance(id, dist)), GeoClient.updateIntervall));
        dispatch(setSpotInterval(id, intId));
    }
}

export function removeSpotInterval(id) {
    return {
        type: REMOVE_SPOT_INTERVAL,
        spotId: id
    }
}

