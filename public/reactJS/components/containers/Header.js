/**
 * Created by Johnh on 2017-03-19.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeScene, fetchUser, receiveLogin, fetchLogout } from '../redux/actions';
import { SCENE } from '../redux/constants';
import { LoginButton, RegisterButton, HomeButton, LogoutButton } from '../presentational/HeaderButtons';
import Error from '../presentational/Error';

class Header extends Component {
    constructor(props){
        super(props);
        this.onChangeScene = this.onChangeScene.bind(this);
    }
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(fetchUser(receiveLogin));
    }
    onChangeScene(scene){
        const { dispatch } = this.props;
        dispatch(changeScene(scene));
    }
    render(){
        const { isLogged, userName, error, dispatch } = this.props;
        return(
            <header>
                {error.status &&
                    <Error {...error}/>
                }
                <HomeButton onClick={() => this.onChangeScene(SCENE.SHOW_PARKING_LOTS)}/>
                {!isLogged &&
                    <LoginButton onClick={() => this.onChangeScene(SCENE.SHOW_LOGIN)}/>
                }
                {isLogged &&
                    <span>
                        <h1>{ userName }</h1>
                        <LogoutButton onClick={() => dispatch(fetchLogout()) } />
                    </span>
                }
                <RegisterButton onClick={() => this.onChangeScene(SCENE.SHOW_REGISTER)}/>
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