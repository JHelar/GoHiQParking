/**
 * Created by Johnh on 2017-03-19.
 */
/**
 * Created by Johnh on 2017-03-19.
 */
import React, { Component, PropTypes } from 'react';
import { fetchRegister } from '../redux/actions';
import { connect } from 'react-redux';

let Register = ({ dispatch }) => {
    let inputUserName;
    let inputEmail;
    let inputPassword;

    return(
        <main className="content">
            <h1>Register</h1>
            <form onSubmit={e => {
                e.preventDefault();
                dispatch(fetchRegister(inputUserName.value, inputEmail.value, inputPassword.value));
            }}>
                <input ref={node => {
                    inputUserName = node;
                }} type="text" placeholder="Username"/>
                <input ref={node => {
                    inputPassword = node;
                }} type="password" placeholder="password"/>
                <input ref={node => {
                    inputEmail = node;
                }} type="email" placeholder="email"/>
                <button type="submit" >Register</button>
            </form>
        </main>
    );
};

export default connect()(Register);