/**
 * Created by Johnh on 2017-03-19.
 */
import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';

render(
    <Root />,
    document.getElementById('root')
);