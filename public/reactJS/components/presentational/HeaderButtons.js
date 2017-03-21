/**
 * Created by Johnh on 2017-03-19.
 */
import React, { PropTypes } from 'react';

// Login
export const LoginButton = ({ onClick }) => {
    return(
        <a onClick={onClick} className="uppercase">
            <span>
                Login
                <i className="flavor green">Welcome back!</i>
            </span>
        </a>
    );
};

LoginButton.propTypes = {
    onClick: PropTypes.func
};

// Register
export const RegisterButton = ({ onClick }) => {
    return(
        <a onClick={onClick} className="uppercase">
            <span>
                Register
                <i className="flavor yellow">Come join us!</i>
            </span>
        </a>
    );
};

RegisterButton.propTypes = {
    onClick: PropTypes.func
};

// Home
export const HomeButton = ({ onClick }) => {
    return (
        <a className="home-button" onClick={onClick}>
            HiQ<i className="flavor pink">Parking</i>
        </a>
    );
};

HomeButton.propTypes = {
  onClick: PropTypes.func
};

// Menubutton
export const MenuButton = ({ onClick, open }) => {
    const openClass = open ? "hamburger open" : "hamburger";
    return (
        <a onClick={onClick} className="menu-button">
            <div className={openClass}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <i className="arrow-left"></i>
            <span className="text">Menu</span>
        </a>
    );
};
MenuButton.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool.isRequired
};

// Logout
export const LogoutButton = ({ onClick }) => {
    return (
        <a onClick={onClick} className="uppercase">
            <span>
                Logout
                <i className="flavor blue">Oh no don't leave us!</i>
            </span>
        </a>
    );
};

LogoutButton.propTypes = {
    onClick: PropTypes.func
};
