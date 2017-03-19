/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';
import { timeDifference } from '../../../general/helpers';

const Spot = ({onClick, id, name, isparked, canmodify, parkedby, parkedtime}) => {
    let buttonTxt = isparked ? "Leave" : "Park";
    return(
        <div>
            <h4>{name}</h4>
            {isparked &&
            <p>{parkedby} - {timeDifference(new Date(parkedtime))}</p>
            }
            {canmodify &&
            <button onClick={onClick}>
                { buttonTxt }
            </button>
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
    parkedtime: PropTypes.string.isRequired
};

export default Spot;