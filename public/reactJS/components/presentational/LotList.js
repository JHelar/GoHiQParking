/**
 * Created by Johnh on 2017-03-19.
 */
import Lot from './Lot';
import React, { PropTypes } from 'react';

const LotList = ({ show, lots, onLotClick }) => {
    let cn = show ? "lot-wrapper" : "lot-wrapper hide-lots";
    return (<main className={cn}>
        {lots.map(lot =>
            <Lot
                key={ lot.id }
                { ...lot }
                onClick={ () => onLotClick(lot.id) }
            />
        )}
    </main>);
};

LotList.propTypes = {
    onLotClick: PropTypes.func,
    show: PropTypes.bool.isRequired,
    lots: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
    }).isRequired)
};

export default LotList;