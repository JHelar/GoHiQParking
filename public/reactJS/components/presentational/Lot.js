/**
 * Created by Johnh on 2017-03-19.
 */
import { SCENE } from '../redux/constants';
import React, { PropTypes } from 'react';
import Spot from './Spot';

const Lot = ({onClick, onSpotClick, scene, id, name, location, isLogged, spots}) => {
    if(scene == SCENE.SHOW_SPOTS){
        return(
            <div className="small-12 column lot-focused">
                <h2>{name}</h2>
                <h3>{location}</h3>
                <div className="row">
                {spots !== undefined &&
                    spots.map(spot =>
                    <Spot
                        key={ spot.id }
                        isLogged={isLogged}
                        onClick={() => onSpotClick(spot.id)}
                        { ...spot }

                    />
                )}
                </div>
            </div>
        );
    }else if(scene === SCENE.SHOW_PARKING_LOTS) {
        return (
            <div className="small-12 medium-6 large-4 column lot" onClick={onClick}>
                <h2>{name}</h2>
                <h3>{location}</h3>
            </div>
        );
    }
};

Lot.propTypes = {
    onClick: PropTypes.func,
    onSpotClick: PropTypes.func,
    scene: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    isLogged: PropTypes.bool.isRequired,
    spots: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        isparked: PropTypes.bool.isRequired,
        canmodify: PropTypes.bool.isRequired,
        parkedby: PropTypes.string.isRequired,
        parkedtime: PropTypes.string.isRequired
    }).isRequired).isRequired
};

export default Lot;