/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';

const Error = ({ type, message }) => {
    return(
        <section className="error-frame">
            <p><strong>{ type }</strong>: { message }</p>
        </section>
    );
};

Error.propTypes = {
    type: PropTypes.string,
    message: PropTypes.string
};

export default Error;