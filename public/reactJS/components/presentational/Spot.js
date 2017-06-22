/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';
import { timeDifference } from '../../../general/helpers';
import { Component } from 'react';
import GeoClient from '../../../general/GeoClient';


class Spot extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const { onInfoClick, onClick, onLoginClick, canGeoPoll, distance, name, isparked, canmodify, parkedby, parkedtime, isLogged } = this.props;
        let buttonTxt = isparked ? "Leave" : "Park";
        let spotClass = isparked ? "spot parked" : "spot";
        return (
            <div className="small-12 medium-4 large-3 column">
                <span className="name">{name}</span>
                <button onClick={onInfoClick} className="info">Show info</button>
                <div className={spotClass}>
                    {isparked &&
                    <p>{parkedby} - {timeDifference(new Date(parkedtime))}</p>
                    }
                    { canGeoPoll &&
                    <p>{distance}</p>
                    }
                    {(canmodify && isparked) &&
                    <button onClick={onClick} className="button-flavor green">
                        { buttonTxt }
                    </button>
                    }
                    {(canmodify && !isparked) &&
                    <button onClick={onClick} className="button-flavor blue">
                        { buttonTxt }
                    </button>
                    }
                    {(!isLogged && !isparked) &&
                    <button onClick={onLoginClick}>Login to park</button>
                    }
                </div>
            </div>
        );
    }
};

Spot.propTypes = {
    onRemoveSpotInterval: PropTypes.func,
    onSetupSpotInterval: PropTypes.func,
    onInfoClick: PropTypes.func,
    onClick: PropTypes.func,
    onLoginClick: PropTypes.func,
    canGeoPoll: PropTypes.bool.isRequired,
    distance: PropTypes.number,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isparked: PropTypes.bool.isRequired,
    canmodify: PropTypes.bool.isRequired,
    parkedby: PropTypes.string.isRequired,
    parkedtime: PropTypes.string.isRequired,
    isLogged: PropTypes.bool.isRequired
};

export default Spot;