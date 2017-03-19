import fetch from 'isomorphic-fetch';
import { createCookie, getCookie } from '../../../general/helpers';
import { SCENE } from './constants';

// API ACTIONS
// Get parking lots
export const FETCH_PARKING_LOTS_REQUEST = 'FETCH_PARKING_LOTS_REQUEST';
export const FETCH_PARKING_LOTS_SUCCESS = 'FETCH_PARKING_LOTS_SUCCESS';
export const FETCH_PARKING_LOTS_ERROR = 'FETCH_PARKING_LOTS_ERROR';

export const FETCH_SPOTS_REQUEST = 'FETCH_SPOTS_REQUEST';
export const FETCH_SPOTS_SUCCESS = 'FETCH_SPOTS_SUCCESS';
export const FETCH_SPOTS_ERROR = 'FETCH_SPOTS_ERROR';

export const FETCH_TOGGLE_SPOT_REQUEST = 'FETCH_TOGGLE_SPOT_REQUEST';
export const FETCH_TOGGLE_SPOT_SUCCESS = 'FETCH_TOGGLE_SPOT_SUCCESS';
export const FETCH_TOGGLE_SPOT_ERROR = 'FETCH_TOGGLE_SPOT_ERROR';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const SHOW_PARKING_LOTS = 'SHOW_PARKING_LOTS';
export const SELECT_PARKING_LOT = 'SELECT_PARKING_LOT';
export const TOGGLE_SPOT = 'TOGGLE_SPOT';
export const CHANGE_SCENE = 'CHANGE_SCENE';

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
		return fetch('api/lot/getAll')
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
		return fetch('api/lot/fill',{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({id: parkingLot, sessionKey: getCookie("skey")})
			})
			.then(response => response.json())
			.then(json => {
				if(json.error) dispatch(receiveSpotsError(parkingLot, json));
				else{
				    dispatch(receiveSpots(parkingLot, json));
                    dispatch(changeScene(SCENE.SHOW_SPOTS));
				}
			})
            .catch(function(ex) {
                dispatch(receiveSpotsError(parkingLot, { message: "Exception: " + ex }));
            });
	};
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
		return fetch('api/spot/toggle', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
				    sessionKey: getCookie("skey"),
					id:spot
				})
			})
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

export function reciveLogin(json) {
    return {
        type: LOGIN_SUCCESS,
        user: json.data
    }
}

export function reciveLoginError(json) {
    return {
        type: LOGIN_ERROR,
        error_msg: json.message
    }
}

export function fetchUser() {
    return dispatch => {
        return fetch('api/user/get', {
                method:'POST',
                body: JSON.stringify({
                    sessionKey: getCookie("skey")
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(reciveLoginError(json));
                else {
                    dispatch(reciveLogin(json));
                    dispatch(changeScene(SCENE.SHOW_PARKING_LOTS));
                }
            })
            .catch(function (ex) {
                dispatch(reciveLoginError({message: "fetchUser: " + ex}));
            })
    };
}

export function fetchLogin(usernameemail, password) {
    return dispatch => {
        dispatch(requestLogin());
        return fetch('api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usernameemail: usernameemail,
                    password: password
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(reciveLoginError(json));
                else {
                    createCookie("skey", json.data.sessionkey, 360);
                    dispatch(fetchUser());
                }
            })
            .catch(function(ex) {
                dispatch(reciveLoginError({ message: "fetchLogin: " + ex }));
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