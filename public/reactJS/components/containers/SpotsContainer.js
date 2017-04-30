/**
 * Created by Johnh on 2017-04-02.
 */
import {toggleSpot, fetchToggleSpot, changeScene, fetchSpotInfo, showSpotInfo } from '../redux/actions';
import { connect } from 'react-redux';
import SpotList from '../presentational/SpotList';
import { SCENE } from '../redux/constants';

const mapStateToProps = (state) => {
    let currentLot = state.parkingLots.lots.filter((lot) => {
        return lot.id === state.parkingLots.selectedParkingLot;
    })[0];
    let lotName = currentLot === undefined ? "" : currentLot.name;
    let spots = currentLot === undefined ? [] : currentLot.spots;

    return {
        lotName: lotName,
        isLogged: state.user.isLogged,
        spots: spots
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onInfoClick: (id) => {
            dispatch(fetchSpotInfo(id));
            dispatch(showSpotInfo(id));
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