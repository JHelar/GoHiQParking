import { combineReducers } from 'redux';
import { SCENE } from 'constants';
import {
    FETCH_PARKING_LOTS_REQUEST,
	FETCH_PARKING_LOTS_SUCCESS,
	FETCH_PARKING_LOTS_ERROR,
	FETCH_SPOTS_REQUEST,
	FETCH_SPOTS_SUCCESS,
	FETCH_SPOTS_ERROR,
	FETCH_TOGGLE_SPOT_REQUEST,
	FETCH_TOGGLE_SPOT_SUCCESS,
	FETCH_TOGGLE_SPOT_ERROR,
	SHOW_PARKING_LOTS,
	SELECT_PARKING_LOT,
	TOGGLE_SPOT,
	CHANGE_SCENE
} from 'actions';



// Reducers
function lots(state = [], action, selectedLot){
    return state.map((lot_state, _) => {
        if(lot_sate.id === selectedLot){
            return lot(lot_state, action);
        }
    })
}
function lot(state = {
    id: 0,
    name: "",
    location: "",
    didInvalidate: false,
    isFetching: false,
    lastUpdate: Date.now(),
    spots: []
}, action){
	switch(action.type){
		case TOGGLE_SPOT:
			return Object.assign({}, state, {
				didInvalidate: true
			});
		case FETCH_SPOTS_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			});
		case FETCH_SPOTS_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				lastUpdate: action.received_at,
				spots: action.spots
			});
		case FETCH_SPOTS_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false
			});
		case FETCH_TOGGLE_SPOT_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false,
			});
		case FETCH_TOGGLE_SPOT_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				spots: action.spots,
				lastUpdate: action.received_at
			});
		case FETCH_TOGGLE_SPOT_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false
			});
		default:
			return state;
	}
}
function parkingLots(state = {
	isFetching: false,
	didInvalidate: false,
	lastUpdate: Date.now(),
	lots: []	
}, action) {
	switch(action.type){
		case SELECT_PARKING_LOT:
			return Object.assign({}, state, {
				didInvalidate: false,
                error: { status: false },
				selectedParkingLot: action.parkingLot
			});
		case SHOW_PARKING_LOTS:
			return Object.assign({}, state, {
				didInvalidate: true,
                error: { status: false }
			});
		case FETCH_PARKING_LOTS_REQUEST:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: true,
				error: { status: false }
			});
		case FETCH_PARKING_LOTS_SUCCESS:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
                error: { status: false },
				lots: action.parking_lots,
				lastUpdate: action.received_at
			});
		case FETCH_PARKING_LOTS_ERROR:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
                error: { status: false, message: action.error_msg }
			});
		case FETCH_SPOTS_REQUEST:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
                error: { status: false },
				selectedParkingLot: action.parkingLot,
				lots: lots(state.lots, action, action.parkingLot)
			});
        case FETCH_SPOTS_SUCCESS:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
				error: { status : false },
				lots: lots(state.lots, action, action.parkingLot)
			});
		case FETCH_SPOTS_ERROR:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
				error: { state: true, message: action.error_msg },
                lots: lots(state.lots, action, action.parkingLot)
			});
		case TOGGLE_SPOT:
		case FETCH_TOGGLE_SPOT_REQUEST:
		case FETCH_TOGGLE_SPOT_SUCCESS:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
				lots: lots(state.lots, action, action.selectedParkingLot)
			});
		case FETCH_TOGGLE_SPOT_ERROR:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
				error: { state: true, message: action.error_msg },
                lots: lots(state.lots, action, action.selectedParkingLot)
			});
		default:
			return state;
	}
}

function currentScene(state = SCENE.SHOW_PARKING_LOTS, action){
	switch(action.type){
		case CHANGE_SCENE:
			return action.scene;
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	currentScene,
	parkingLots
});

export default rootReducer;