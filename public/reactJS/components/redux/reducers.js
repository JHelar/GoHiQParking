import { combineReducers } from 'redux';
import { SCENE } from './constants';
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
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
	SHOW_PARKING_LOTS,
	SELECT_PARKING_LOT,
	TOGGLE_SPOT,
	CHANGE_SCENE
} from './actions';



// Reducers

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
                spots: state.spots.map((spot, _) => {
				    if(spot.id === action.spot.id){
				        return Object.assign({}, spot, action.spot);
                    }
                    return spot
                }),
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
				selectedParkingLot: action.parkingLot
			});
		case SHOW_PARKING_LOTS:
			return Object.assign({}, state, {
				didInvalidate: true
			});
		case FETCH_PARKING_LOTS_REQUEST:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: true,
			});
		case FETCH_PARKING_LOTS_SUCCESS:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
				lots: action.parking_lots,
				lastUpdate: action.received_at
			});
		case FETCH_PARKING_LOTS_ERROR:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false
			});
		case FETCH_SPOTS_REQUEST:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
				selectedParkingLot: action.parkingLot,
				lots: state.lots.map((lot_state, _) => {
				    if(lot_state.id === action.parkingLot){
				        return Object.assign({}, lot_state, lot(lot_state, action));
                    }
                    return lot_state;
				})
			});
        case FETCH_SPOTS_SUCCESS:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
                lots: state.lots.map((lot_state, _) => {
                    return Object.assign({}, lot_state, lot(lot_state, action));
                })
			});
		case FETCH_SPOTS_ERROR:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
                lots: state.lots.map((lot_state, _) => {
                    if(lot_state.id === action.parkingLot){
                        return Object.assign({}, lot_state, lot(lot_state, action));
                    }
                    return lot_state;
                })
			});
		case TOGGLE_SPOT:
		case FETCH_TOGGLE_SPOT_REQUEST:
		case FETCH_TOGGLE_SPOT_SUCCESS:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
                lots: state.lots.map((lot_state, _) => {
                    if(lot_state.id === state.selectedParkingLot){
                        return Object.assign({}, lot_state, lot(lot_state, action));
                    }
                    return lot_state;
                })
			});
		case FETCH_TOGGLE_SPOT_ERROR:
			return Object.assign({}, state, {
				didInvalidate: false,
				isFetching: false,
                lots: state.lots.map((lot_state, _) => {
                    if(lot_state.id === state.selectedParkingLot){
                        return Object.assign({}, lot_state, lot(lot_state, action));
                    }
                    return lot_state;
                })
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

function user(state = {
    isLogged: false
}, action) {
    switch(action.type){
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                isLogged: false
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isLogged: true,
                name: action.user.username
            });
        case LOGIN_ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                isLogged: false
            });
        default:
            return state;
    }
}

function error(state = {
    status: false
}, action) {
    switch(action.type){
        case FETCH_PARKING_LOTS_ERROR:
        case FETCH_SPOTS_ERROR:
        case FETCH_TOGGLE_SPOT_ERROR:
        case LOGIN_ERROR:
            return Object.assign({}, state, {
                status: true,
                message: action.error_msg,
                type: action.type
            });
        default:
            return Object.assign({}, state, {
                status: false
            });
    }
}

const rootReducer = combineReducers({
    error,
    user,
	currentScene,
	parkingLots
});

export default rootReducer;