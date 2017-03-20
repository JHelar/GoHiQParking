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
        <a className="home-button" onClick={onClick}>
            HiQ<i className="flavor">Parking</i>
        </a>
    );
};

HomeButton.propTypes = {
  onClick: PropTypes.func
};

// Menubutton
export const MenuButton = () => {
    return (
        <a data-toggle="menu" className="menu-button">
            <i className="hamburger"></i>
            <span className="text">Menu</span>
        </a>
    );
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
