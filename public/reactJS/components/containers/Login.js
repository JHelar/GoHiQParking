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
        <main className="content">
            <h1>Login</h1>
            <form onSubmit={e => {
                e.preventDefault();
                dispatch(fetchLogin(inputNameEmail.value, inputPassword.value));
            }}>
                <input ref={node => {
                    inputNameEmail = node;
                }} type="text"/>
                <input ref={node => {
                    inputPassword = node;
                }} type="password"/>
                <button type="submit" >Login</button>
            </form>
        </main>
    );
};

export default connect()(Login);