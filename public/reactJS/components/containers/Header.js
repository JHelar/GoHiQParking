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
            <div className={"small-12"}>
                {error.status &&
                    <Error {...error}/>
                }
                <header id="main-header" className="row">
                    <HomeButton onClick={() => this.onChangeScene(SCENE.SHOW_PARKING_LOTS)}/>
                    <a data-toggle="menu" className="menu-button columns">
                        <span>
                            <i className="hamburger"></i>
                            <span className="text">Menu</span>
                        </span>
                    </a>
                </header>
                <div id="menu" data-toggler="show">
                    {!isLogged &&
                    <LoginButton onClick={() => this.onChangeScene(SCENE.SHOW_LOGIN)}/>
                    }
                    {isLogged &&
                    <span className="user-name">{ userName }</span>
                    }
                    {isLogged &&
                    <LogoutButton onClick={() => dispatch(fetchLogout()) } />
                    }
                    <RegisterButton onClick={() => this.onChangeScene(SCENE.SHOW_REGISTER)}/>
                </div>
            </div>
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