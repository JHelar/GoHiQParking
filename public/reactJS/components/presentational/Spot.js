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
        const { onClick, onLoginClick, canGeoPoll, distance, name, isparked, canmodify, parkedby, parkedtime, isLogged } = this.props;
        let buttonTxt = isparked ? "Leave" : "Park";
        let spotClass = isparked ? "spot parked" : "spot";
        let spotClick = !isLogged && !isparked ? onLoginClick : isLogged && canmodify ? onClick : null;
        return (
            <div className="small-12 medium-4 large-3 column" onClick={spotClick}>
                <span className="name">{name}</span>
                <div className={spotClass}>
                    {isparked &&
                    <p className="parked-by"><span className="user-name">{parkedby}</span> <span className="time">{timeDifference(new Date(parkedtime))}</span></p>
                    }
                    { canGeoPoll &&
                    <p>{distance}</p>
                    }
                    {(canmodify && isparked) &&
                    <button className="button-flavor green">
                        { buttonTxt }
                    </button>
                    }
                    {(canmodify && !isparked) &&
                    <button className="button-flavor blue">
                        { buttonTxt }
                    </button>
                    }
                    {(!isLogged && !isparked) &&
                    <button className="button-flavor pink">Login to park</button>
                    }
                </div>
            </div>
        );
    }
};

Spot.propTypes = {
    onRemoveSpotInterval: PropTypes.func,
    onSetupSpotInterval: PropTypes.func,
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