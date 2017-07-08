/**
 * Created by Johnh on 2017-04-02.
 */
import {toggleSpot, fetchToggleSpot, changeScene, fetchSpotInfo, showSpotInfo, setupSpotInterval, removeSpotInterval  } from '../redux/actions';
import { connect } from 'react-redux';
import SpotList from '../presentational/SpotList';
import { SCENE } from '../redux/constants';

const mapStateToProps = (state) => {
    let currentLot = state.parkingLots.lots.filter((lot) => {
        return lot.id === state.parkingLots.selectedParkingLot;
    })[0];
    let lotName = currentLot === undefined ? "" : currentLot.name;
    let spots = currentLot === undefined ? [] : currentLot.spots;
    let lotLocation = currentLot === undefined ? "" : currentLot.location;
    return {
        lotName: lotName,
        lotLocation: lotLocation,
        isLogged: state.user.isLogged,
        canGeoPoll: state.user.canGeoPoll,
        spots: spots !== undefined ? spots.map((spot, _) => {
            return {
                id: spot.id,
                name: spot.name,
                isparked: spot.isparked,
                canmodify: spot.canmodify,
                parkedby: spot.parkedby,
                parkedtime: spot.parkedtime,
                distance: spot.distance,
                pos: spot.spotinfo !== null && spot.spotinfo !== undefined ? { long: spot.spotinfo.longitude, lat: spot.spotinfo.latitude } : undefined
            }
        }) : []
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSetupSpotInterval: (id, pos) => {
            dispatch(fetchSpotInfo(id));
        },
        onRemoveSpotInterval: (id) => {
        },
        onLoginClick: () => dispatch(changeScene(SCENE.SHOW_LOGIN)),
        onSpotClick: (id) => {
            dispatch(toggleSpot(id));
            dispatch(fetchToggleSpot(id));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps)(SpotList);