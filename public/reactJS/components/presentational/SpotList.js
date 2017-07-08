/**
 * Created by Johnh on 2017-04-02.
 */
import React, { Component, PropTypes } from 'react';
import Spot from '../presentational/Spot';
import { createMapsUrl } from '../../../general/helpers';

const SpotsList = ({lotName, spots, canGeoPoll, isLogged, onRemoveSpotInterval, onSetupSpotInterval, onSpotClick, lotLocation, onLoginClick}) => {

    return (spots !== undefined && <main>
        <h1 className="current-lot-name">{lotName}</h1>
        <a  className="current-lot-location" target="_blank" href={createMapsUrl(lotLocation)}>{lotLocation}</a>
        <div className="spots-wrapper row align-spaced">
        {spots.map(spot =>
            <Spot
                { ...spot }
                canGeoPoll={canGeoPoll}
                isLogged={isLogged}
                key={spot.id}
                onRemoveSpotIntervall={() => onRemoveSpotInterval(spot.id)}
                onSetUpSpotIntervall={() => onSetupSpotInterval(spot.id, spot.pos)}
                onClick={() => onSpotClick(spot.id)}
                onLoginClick={onLoginClick}
            />
        )}
        </div>
    </main>);
};

SpotsList.propTypes = {
    onSetupSpotInterval: PropTypes.func,
    onRemoveSpotInterval: PropTypes.func,
    onSpotClick: PropTypes.func,
    onLoginClick: PropTypes.func,
    lotLocation: PropTypes.string,
    lotName: PropTypes.string.isRequired,
    canGeoPoll: PropTypes.bool.isRequired,
    spots: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            isparked: PropTypes.bool.isRequired,
            canmodify: PropTypes.bool.isRequired,
            parkedby: PropTypes.string.isRequired,
            parkedtime: PropTypes.string.isRequired,
            distance: PropTypes.number,
            pos: PropTypes.shape({
                long: PropTypes.number,
                lat: PropTypes.number
            })
        }).isRequired),
    isLogged: PropTypes.bool.isRequired
};

export default SpotsList;
