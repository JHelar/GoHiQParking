/**
 * Created by Johnh on 2017-04-02.
 */
import {toggleSpot, fetchToggleSpot } from '../redux/actions';
import { connect } from 'react-redux';
import SpotList from '../presentational/SpotList';

const mapStateToProps = (state) => {
    let currentLot = state.parkingLots.lots.filter((lot) => {
        return lot.id === state.parkingLots.selectedParkingLot;
    })[0];

    let spots = currentLot === undefined ? [] : currentLot.spots;

    return {
        isLogged: state.user.isLogged,
        spots: spots
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSpotClick: (id) => {
            dispatch(toggleSpot(id));
            dispatch(fetchToggleSpot(id));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps)(SpotList);