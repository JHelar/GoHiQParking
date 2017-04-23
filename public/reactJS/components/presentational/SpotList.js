/**
 * Created by Johnh on 2017-04-02.
 */
import React, { Component, PropTypes } from 'react';
import Spot from '../presentational/Spot';

const SpotsList = ({lotName, spots, isLogged, onSpotClick}) => {

    return (<main>
        <h1 className="current-lot-name">{lotName}</h1>
        <div className="spots-wrapper row align-spaced">
        {spots.map(spot =>
            <Spot
                { ...spot }
                isLogged={isLogged}
                onClick={() => onSpotClick(spot.id)}
            />
        )}
        </div>
    </main>);
};

SpotsList.propTypes = {
    onSpotClick: PropTypes.func,
    lotName: PropTypes.string.isRequired,
    spots: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            isparked: PropTypes.bool.isRequired,
            canmodify: PropTypes.bool.isRequired,
            parkedby: PropTypes.string.isRequired,
            parkedtime: PropTypes.string.isRequired
        }).isRequired),
    isLogged: PropTypes.bool.isRequired
};

export default SpotsList;
