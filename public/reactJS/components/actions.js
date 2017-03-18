import fetch from 'isomorphic-fetch';

// API ACTIONS
// Get parking lots
export const FETCH_PARKING_LOTS_REQUEST = 'FETCH_PARKING_LOTS_REQUEST';
export function requestParkingLots() {
	return {
		type: FETCH_PARKING_LOTS_REQUEST
	};
}

export const FETCH_PARKING_LOTS_SUCCESS = 'FETCH_PARKING_LOTS_SUCCESS';
export function receiveParkingLots(json){
	return {
		type: FETCH_PARKING_LOTS_SUCCESS,
		parking_lots: json.data,
		received_at: Date.now()
	};
}

export const FETCH_PARKING_LOTS_ERROR = 'FETCH_PARKING_LOTS_ERROR';
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
			});
	};
}

// Get spots
export const FETCH_SPOTS_REQUEST = 'FETCH_SPOTS_REQUEST';
export function requestSpots(parkingLot){
	return {
		type: FETCH_SPOTS_REQUEST,
		parkingLot
	};
}

export const FETCH_SPOTS_SUCCESS = 'FETCH_SPOTS_SUCCESS';
export function receiveSpots(parkingLot, json) {
	return {
		type: FETCH_SPOTS_SUCCESS,
		spots: json.data.spots,
		received_at: Date.now(),
		parkingLot
	}
}

export const FETCH_SPOTS_ERROR = 'FETCH_SPOTS_ERROR';
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
				body: JSON.stringify(parkingLot)
			})
			.then(response => response.json())
			.then(json => {
				if(json.error) dispatch(receiveSpotsError(goParking, json));
				else dispatch(receiveSpots(goParking, json));
			});
	};
}

// POST Toggle
export const FETCH_TOGGLE_SPOT_REQUEST = 'FETCH_TOGGLE_SPOT_REQUEST';
export function requestToggleSpot(spot) {
	return {
		type: FETCH_TOGGLE_SPOT_REQUEST,
		spot
	}
}

export const FETCH_TOGGLE_SPOT_SUCCESS = 'FETCH_TOGGLE_SPOT_SUCCESS';
export function receiveToggleSpot(spot, json){
	return {
		type: FETCH_TOGGLE_SPOT_SUCCESS,
		spot,
		spots: json.data,
		received_at: Date.now()
	}
}

export const FETCH_TOGGLE_SPOT_ERROR = 'FETCH_TOGGLE_SPOT_ERROR';
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
					id:spot
				})
			})
			.then(response => response.json())
			.then(json => {
				if(json.error) dispatch(receiveToggleSpotError(spot, json));
				else dispatch(receiveToggleSpot(spot, json));
			});
	};
}

// USER ACTIONS
export const SHOW_PARKING_LOTS = 'SHOW_PARKING_LOTS';
export function showParkingLots() {
	return {
		type: SHOW_PARKING_LOTS
	};
}
export const boundShowParkingLots = () => dispatch(showParkingLots());

export const SELECT_PARKING_LOT = 'SELECT_PARKING_LOT';
export function selectParkingLot(parkingLot) {
	return {
		type: SELECT_PARKING_LOT,
		parkingLot
	};
}
export const boundSelectParkingLot = (parkingLot) => dispatch(selectParkingLot(parkingLot));

export const TOGGLE_SPOT = 'TOGGLE_SPOT';
export function toggleSpot(spot) {
	return {
		type: TOGGLE_SPOT,
		spot
	};
}
export const boundToggleSpot = (spot) => dispatch(toggleSpot(spot));

export const CHANGE_SCENE = 'CHANGE_SCENE';
export function changeScene(scene) {
	return {
		type: CHANGE_SCENE,
		scene
	};
}
export const boundChangeScene = (scene) => dispatch(changeScene(scene));