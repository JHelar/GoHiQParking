/**
 * Created by Johnh on 2017-03-19.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SceneSwapper from './SceneSwapper';
import Header from './Header';
import LotsContanier from './LotsContainer';
import SpotInfoContainer from './SpotInfoContainer';
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
        // ToDo: Add event stream!!
        return(
            <section className="">
                <Header />
                <LotsContanier />
                <SceneSwapper />
                <SpotInfoContainer />
            </section>
        );
    }
}

App.propTypes = {
  dispatch: PropTypes.func
};


export default connect()(App);