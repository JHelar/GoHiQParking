/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';
import { timeDifference } from '../../../general/helpers';

const Spot = ({onClick, id, name, isparked, canmodify, parkedby, parkedtime, isLogged}) => {
    let buttonTxt = isparked ? "Leave" : "Park";
    return(
        <div className="spot small-12 medium-6 large-4 column">
            <span className="name">{name}</span>
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
                <p>Login to park</p>
            }
        </div>
    );
};

Spot.propTypes = {
    onClick: PropTypes.func,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isparked: PropTypes.bool.isRequired,
    canmodify: PropTypes.bool.isRequired,
    parkedby: PropTypes.string.isRequired,
    parkedtime: PropTypes.string.isRequired,
    isLogged: PropTypes.bool.isRequired
};

export default Spot;