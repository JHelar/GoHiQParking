/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';

const LoginButton = ({ onClick }) => {
  return(
      <a onClick={onClick}>Login</a>
  );
};

LoginButton.propTypes = {
    onClick: PropTypes.func
};
export default LoginButton;