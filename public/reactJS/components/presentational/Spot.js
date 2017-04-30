/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';
import { timeDifference } from '../../../general/helpers';

const Spot = ({onInfoClick, onClick, onLoginClick, id, name, isparked, canmodify, parkedby, parkedtime, isLogged}) => {
    let buttonTxt = isparked ? "Leave" : "Park";
    let spotClass = isparked ? "spot parked" : "spot";
    return(
        <div className="small-6 medium-4 large-3 column">
            <span className="name">{name}</span>
            <div className={spotClass}>
                {isparked &&
                <p>{parkedby} - {timeDifference(new Date(parkedtime))}</p>
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
            <button onClick={onInfoClick}>Show info</button>
        </div>
    );
};

Spot.propTypes = {
    onInfoClick: PropTypes.func,
    onClick: PropTypes.func,
    onLoginClick: PropTypes.func,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isparked: PropTypes.bool.isRequired,
    canmodify: PropTypes.bool.isRequired,
    parkedby: PropTypes.string.isRequired,
    parkedtime: PropTypes.string.isRequired,
    isLogged: PropTypes.bool.isRequired
};

export default Spot;