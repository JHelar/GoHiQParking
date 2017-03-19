/**
 * Created by Johnh on 2017-03-19.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SceneSwapper from './SceneSwapper';
import Header from './Header';
import { fetchParkingLots } from '../redux/actions';

class App extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(fetchParkingLots());
    }

    render(){
        return(
            <section>
                <Header />
                <SceneSwapper/>
            </section>
        );
    }
}

App.propTypes = {
  dispatch: PropTypes.func
};


export default connect()(App);