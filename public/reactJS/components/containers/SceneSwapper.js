/**
 * Created by Johnh on 2017-03-19.
 */
import { SCENE } from '../redux/constants';
import LotsContainer from './LotsContainer';
import Login from './Login';
import Register from './Register';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class SceneSwapper extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const { scene } = this.props;
        switch (scene) {
            case SCENE.SHOW_PARKING_LOTS:
            case SCENE.SHOW_SPOTS:
                return (
                    <LotsContainer />
                );
            case SCENE.SHOW_LOGIN:
                return (
                    <Login />
                );
            case SCENE.SHOW_REGISTER:
                return (
                    <Register />
                );
            default:
                return (
                    <LotsContainer />
                );
        }
    }
}

SceneSwapper.propTypes = {
    scene: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return {
      scene: state.currentScene
  };
};

export default connect(mapStateToProps)(SceneSwapper);