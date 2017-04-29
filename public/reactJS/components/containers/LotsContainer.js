/**
 * Created by Johnh on 2017-03-19.
 */
import { connect } from 'react-redux';
import { fetchSpots, selectParkingLot, updateLotListener } from '../redux/actions';
import LotList from '../presentational/LotList';
import { SCENE } from '../redux/constants';

const mapStateToProps = (state) => {
    return {
        show: state.scene.current === SCENE.SHOW_PARKING_LOTS,
        lots: state.parkingLots.lots
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLotClick: (id) => {
            dispatch(selectParkingLot(id));
            dispatch(fetchSpots(id));
            dispatch(updateLotListener(id))
        }
    }
};

const LotsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LotList);

export default LotsContainer;