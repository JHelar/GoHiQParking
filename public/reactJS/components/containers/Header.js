/**
 * Created by Johnh on 2017-03-19.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeScene, fetchUser, receiveLogin, fetchLogout, toggleMenu } from '../redux/actions';
import { SCENE } from '../redux/constants';
import { LoginButton, RegisterButton, HomeButton, LogoutButton, MenuButton } from '../presentational/HeaderButtons';
import Error from '../presentational/Error';

class Header extends Component {
    constructor(props){
        super(props);
        this.onChangeScene = this.onChangeScene.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);

    }
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(fetchUser(receiveLogin));
    }
    onToggleMenu(){
        const { dispatch } = this.props;
        dispatch(toggleMenu());
    }
    onChangeScene(scene){
        const { dispatch } = this.props;
        dispatch(changeScene(scene));
    }
    render(){
        const { isLogged, userName, error, dispatch, menuOpen } = this.props;
        const menuShow = menuOpen ? "show" : "";
        return(
            <div className={"small-12"}>
                {error.status &&
                    <Error {...error}/>
                }
                <header id="main-header" className={["align-top"]}>
                    <HomeButton onClick={() => this.onChangeScene(SCENE.SHOW_PARKING_LOTS)}/>
                    <MenuButton open={menuOpen} onClick={() => this.onToggleMenu()}
                    />
                    <div id="menu" className={[menuShow]}>
                        {!isLogged &&
                        <LoginButton onClick={() => this.onChangeScene(SCENE.SHOW_LOGIN)}/>
                        }
                        {isLogged &&
                        <span className="user-name uppercase">{ userName }</span>
                        }
                        {isLogged &&
                        <LogoutButton onClick={() => dispatch(fetchLogout()) } />
                        }
                        <RegisterButton onClick={() => this.onChangeScene(SCENE.SHOW_REGISTER)}/>
                    </div>
                </header>
            </div>
        );
    }
}

Header.propTypes = {
    dispatch: PropTypes.func,
    isLogged: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    menuOpen: PropTypes.bool.isRequired,
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
        error: state.error,
        menuOpen: state.scene.menuOpen,
        prevScene: state.scene.prev
    };
};

export default connect(mapStateToProps)(Header);