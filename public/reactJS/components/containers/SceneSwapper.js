/**
 * Created by Johnh on 2017-03-19.
 */
import { SCENE } from '../redux/constants';
import Login from './Login';
import Register from './Register';
import SpotsContainer from './SpotsContainer';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class SceneSwapper extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const { scene } = this.props;
        switch (scene) {
            case SCENE.SHOW_SPOTS:
            case SCENE.SHOW_PARKING_LOTS:
                return (
                    <SpotsContainer/>
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
                return null;
        }
    }
}

SceneSwapper.propTypes = {
    scene: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
      scene: state.scene.current
  };
};

export default connect(mapStateToProps)(SceneSwapper);