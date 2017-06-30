/**
 * Created by Johnh on 2017-03-19.
 */
import Lot from './Lot';
import React, { PropTypes } from 'react';
import { getCookie } from '../../../general/helpers';

const LotList = ({ show, lots, onLotClick }) => {
    let cn = show ? "lot-wrapper" : "lot-wrapper hide-lots";
    let isFirstTimer = getCookie('dlot') <= 0;
    return (<div className={cn}>
        <div className="lot-texts">
            {isFirstTimer && 
                <div className="welcometext">
                    <h1>Welcome to <span className="logo">HiQ<i className="flavor pink">Parking</i></span></h1>
                </div>
            }
            <p>Where do you want to park?</p>
        </div>
        {lots.map(lot =>
            <Lot
                key={ lot.id }
                { ...lot }
                onClick={ () => onLotClick(lot.id) }
            />
        )}
    </div>);
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