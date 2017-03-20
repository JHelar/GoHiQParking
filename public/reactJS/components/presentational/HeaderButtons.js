/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';

// Login
export const LoginButton = ({ onClick }) => {
    return(
        <a onClick={onClick}>Login</a>
    );
};

LoginButton.propTypes = {
    onClick: PropTypes.func
};

// Register
export const RegisterButton = ({ onClick }) => {
    return(
        <a onClick={onClick}>Register</a>
    );
};

RegisterButton.propTypes = {
    onClick: PropTypes.func
};

// Home
export const HomeButton = ({ onClick }) => {
    return (
        <a className="columns home-button" onClick={onClick}>
            <span>HiQ<i className="flavor">Parking</i></span>
        </a>
    );
};

HomeButton.propTypes = {
  onClick: PropTypes.func
};

// Logout
export const LogoutButton = ({ onClick }) => {
    return (
        <a onClick={onClick}>Logout</a>
    );
};

LogoutButton.propTypes = {
    onClick: PropTypes.func
};
