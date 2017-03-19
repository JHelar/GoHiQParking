/**
 * Created by Johnh on 2017-03-19.
 */
import { connect } from 'react-redux';
import { fetchSpots, fetchToggleSpot, toggleSpot, selectParkingLot } from '../redux/actions';
import LotList from '../presentational/LotList';
import { SCENE } from '../redux/constants';

const mapStateToProps = (state) => {
    return {
        scene: state.currentScene,
        lots: state.parkingLots.lots.filter((lot) => {
            switch(state.currentScene){
                case SCENE.SHOW_SPOTS:
                    return lot.id === state.parkingLots.selectedParkingLot;
                case SCENE.SHOW_PARKING_LOTS:
                    return true;
                default:
                    return false;
            }
        })
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLotClick: (id) => {
            dispatch(selectParkingLot(id));
            dispatch(fetchSpots(id));
        },
        onSpotClick: (id) => {
            dispatch(toggleSpot(id));
            dispatch(fetchToggleSpot(id))
        }
    }
};

const LotsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LotList);

export default LotsContainer;