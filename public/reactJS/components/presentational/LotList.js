/**
 * Created by Johnh on 2017-03-19.
 */
import Lot from './Lot';
import React, { PropTypes } from 'react';

const LotList = ({ show, lots, onLotClick, name }) => {
    let cn = show ? "lot-wrapper" : "lot-wrapper hide-lots";
    return (<header className={cn}>
        {lots.map(lot =>
            <Lot
                key={ lot.id }
                { ...lot }
                onClick={ () => onLotClick(lot.id) }
            />
        )}
        <h1 className="current-lot-name">{name}</h1>
    </header>);
};

LotList.propTypes = {
    onLotClick: PropTypes.func,
    show: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    lots: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
    }).isRequired)
};

export default LotList;