/**
 * Created by Johnh on 2017-03-19.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';
import App from './App';

const configure = configureStore();

export default class Root extends Component {
    render(){
        return(
            <Provider store={configure.store}>
                <App />
            </Provider>
        );
    }
}
