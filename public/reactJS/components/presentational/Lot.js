/**
 * Created by Johnh on 2017-03-19.
 */
import { SCENE } from '../redux/constants';
import React, { PropTypes } from 'react';
import Spot from './Spot';

const Lot = ({onClick, onSpotClick, scene, id, name, location, spots}) => {
    if(scene == SCENE.SHOW_SPOTS){
        return(
            <div>
                <h2>{name}</h2>
                <h3>{location}</h3>
                {spots !== undefined &&
                    spots.map(spot =>
                    <Spot
                        key={ spot.id }
                        onClick={() => onSpotClick(spot.id)}
                        { ...spot }

                    />
                )}
            </div>
        );
    }else if(scene === SCENE.SHOW_PARKING_LOTS) {
        return (
            <div onClick={onClick}>
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