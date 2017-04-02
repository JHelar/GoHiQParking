/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';
import { getHiQGoogleStaticMap } from '../../../general/helpers';

const Lot = ({onClick, name, location}) => {
    return (
        <div className="lot" onClick={onClick} style={{backgroundImage: "url(" + getHiQGoogleStaticMap(location) + ")"}}>
            <h1>{name}</h1>
            <h3>{location}</h3>
        </div>
    );
};

Lot.propTypes = {
    onClick: PropTypes.func,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
};

export default Lot;