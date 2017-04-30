/**
 * Created by Johnh on 2017-04-30.
 */
import { hideSpotInfo } from '../redux/actions';
import { connect } from 'react-redux';
import SpotInfoReveal from '../presentational/SpotInfoReveal';

const mapStateToProps = (state) => {
    let currentLot = state.parkingLots.lots.filter((lot) => {
        return lot.id === state.parkingLots.selectedParkingLot;
    })[0];

    let currentSpotInfo = null;
    if(currentLot !== null && currentLot !== undefined && currentLot.spots !== undefined) {
        currentSpotInfo = currentLot.spots.filter((spot) => {
            return spot.id === state.scene.showSpotInfo.spotId;
        })[0];
        if(currentSpotInfo !== null && currentSpotInfo !== undefined && currentSpotInfo.spotinfo !== undefined) {
            return {
                show: state.scene.showSpotInfo.show,
                spotId: currentSpotInfo.id,
                spotInfo: {
                    name: currentSpotInfo.name,
                    description: currentSpotInfo.spotinfo.description,
                    longitude: currentSpotInfo.spotinfo.longitude,
                    latitude: currentSpotInfo.spotinfo.latitude
                }
            };
        }
    }
    return {
        show: false,
        spotId: 0,
        spotInfo: currentSpotInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => {
            dispatch(hideSpotInfo());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SpotInfoReveal)