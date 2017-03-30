/**
 * Created by Johnh on 2017-03-19.
 */
import Lot from './Lot';
import React, { PropTypes } from 'react';

const LotList = ({scene, lots, isLogged, onLotClick, onSpotClick}) => (
    <main>
        {lots.map(lot =>
            <Lot
                key={ lot.id }
                { ...lot }
                scene={scene}
                isLogged={isLogged}
                onClick={ () => onLotClick(lot.id) }
                onSpotClick={ onSpotClick }
            />
        )}
    </main>
);

LotList.propTypes = {
    onLotClick: PropTypes.func,
    onSpotClick: PropTypes.func,
    scene: PropTypes.string.isRequired,
    isLogged: PropTypes.bool.isRequired,
    lots: PropTypes.arrayOf(PropTypes.shape({
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
        }).isRequired)
    }).isRequired)
};

export default LotList;