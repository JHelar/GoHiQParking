/**
 * Created by Johnh on 2017-04-30.
 */
import React, { PropTypes } from 'react';

const SpotInfoReveal = ({onClose, show, spotId, spotInfo}) => {
    let displayClass = show ? "spotInfo display": "spotInfo";
    return (
      <div className={displayClass}>
          {(spotInfo !== null && spotInfo !== undefined) &&
          <div>
            <h2>{spotInfo.name}</h2>
            <p>{spotInfo.description}</p>
            <button onClick={onClose}>Stäng</button>
          </div>
          }
      </div>
    );
};

SpotInfoReveal.propTypes = {
    onClose: PropTypes.func,
    show: PropTypes.bool.isRequired,
    spotId: PropTypes.number.isRequired,
    spotInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        longitude: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
    })
};

export default SpotInfoReveal;