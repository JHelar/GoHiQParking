import fetch from 'isomorphic-fetch';
import { createCookie, getCookie, deleteCookie } from '../../../general/helpers';
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
		spots: json.data,
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
        return fetch('api/user/get', {
                method:'POST',
                body: JSON.stringify({
                    sessionKey: getCookie("skey")
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(receiveLoginError(json));
                else {
                    dispatch(dispatchCallback(json));
                    dispatch(changeScene(SCENE.SHOW_PARKING_LOTS));
                }
            })
            .catch(function (ex) {
                dispatch(receiveLoginError({message: "fetchUser: " + ex}));
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
                if(json.error) dispatch(receiveLoginError(json));
                else {
                    createCookie("skey", json.data.sessionkey, 360);
                    dispatch(fetchUser(receiveLogin));
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
        return fetch('api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.error) dispatch(receiveRegisterError(json));
                else {
                    createCookie("skey", json.data.sessionkey, 360);
                    dispatch(fetchUser(receiveRegister));
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
        return fetch('api/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionKey: getCookie("skey")
                })
            })
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
};