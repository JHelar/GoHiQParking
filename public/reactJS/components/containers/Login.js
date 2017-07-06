/**
 * Created by Johnh on 2017-03-19.
 */
import React, { Component, PropTypes } from 'react';
import { fetchLogin } from '../redux/actions';
import { connect } from 'react-redux';

let Login = ({ dispatch }) => {
    let inputNameEmail;
    let inputPassword;

    return(
        <main className="content login">
            <h1>Login</h1>
            <form onSubmit={e => {
                e.preventDefault();
                dispatch(fetchLogin(inputNameEmail.value, inputPassword.value));
            }}>
                <input ref={node => {
                    inputNameEmail = node;
                }} type="text" placeholder="Username / Email"/>
                <input ref={node => {
                    inputPassword = node;
                }} type="password" placeholder="Password"/>
                <button type="submit" className="button pink">Login</button>
            </form>
        </main>
    );
};

export default connect()(Login);