/**
 * Created by Johnh on 2017-04-02.
 */
import React, { Component, PropTypes } from 'react';
import Spot from '../presentational/Spot';

const SpotsList = ({spots, isLogged, onSpotClick}) => {

    return (<main className="content spots-wrapper row">
        {spots.map(spot =>
            <Spot
                { ...spot }
                isLogged={isLogged}
                onClick={() => onSpotClick(spot.id)}
            />
        )}
    </main>);
};

SpotsList.propTypes = {
    onSpotClick: PropTypes.func,
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