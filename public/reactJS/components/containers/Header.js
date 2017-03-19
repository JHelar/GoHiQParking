/**
 * Created by Johnh on 2017-03-19.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeScene, fetchUser } from '../redux/actions';
import { SCENE } from '../redux/constants';
import LoginButton from '../presentational/LoginButton';
import Error from '../presentational/Error';

class Header extends Component {
    constructor(props){
        super(props);
        this.onChangeScene = this.onChangeScene.bind(this);
    }
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(fetchUser());
    }
    onChangeScene(scene){
        const { dispatch } = this.props;
        dispatch(changeScene(scene));
    }
    render(){
        const { isLogged, userName, error } = this.props;
        return(
            <header>
                {error.status &&
                    <Error {...error}/>
                }
                {!isLogged &&
                    <LoginButton onClick={() => this.onChangeScene(SCENE.SHOW_LOGIN)}/>
                }
                {isLogged &&
                    <h1>{ userName }</h1>
                }
            </header>
        );
    }
}

Header.propTypes = {
    dispatch: PropTypes.func,
    isLogged: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    error: PropTypes.shape({
        type: PropTypes.string,
        message: PropTypes.string,
        status: PropTypes.bool.isRequired
    }).isRequired
};

const mapStateToProps = (state) => {
    return {
        isLogged: state.user.isLogged,
        userName: state.user.name,
        error: state.error
    };
};

export default connect(mapStateToProps)(Header);