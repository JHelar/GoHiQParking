/**
 * Created by Johnh on 25/03/2017.
 */
import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import { toggleMapReveal } from '../redux/actions';
import { getGoogleStaticMap } from '../../../general/helpers';

// This component might mutate it's state but it is mutating locally and it does not affect the state globally.
// Thus I am not using the redux store in order to change the state of the component.

const MapReveal = ({onRevealClick, location, flavorText, show}) => {
    let mapUrl = getGoogleStaticMap(location);
    let displayClass = show ? "map-reveal show" : "map-reveal";
    return (
        <div className={displayClass}>
            <a className="button-flavor green" onClick={() => onRevealClick()}>&gt;{flavorText}&lt;</a>
            <div className="map">
                <img src={mapUrl}/>
            </div>
        </div>
    );
};

MapReveal.propTypes = {
    onRevealClick: PropTypes.func,
    location: PropTypes.string.isRequired,
    flavorText: PropTypes.string,
    show: PropTypes.bool
};


const mapStateToProps = (state) => {
    return {
        show: state.scene.showMapReveal
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRevealClick: () => {
            dispatch(toggleMapReveal());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapReveal);