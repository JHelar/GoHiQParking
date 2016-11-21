/**
 * Created by johnla on 2016-11-21.
 */
import React from 'react';
import ReactDOM from 'react-dom';

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLogged:props.isLogged,
            user:props.user
        };
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout(e){
        e.preventDefault();
        //var _this = this;
        $.post('api/user/logout',null, function (e) {
            if(!e.data.error){
                /*_this.setState({
                    isLogged:false,
                    user:null,
                });*/
                window.location.href = '/';
            }
        },'json');

    }
    render(){
        var rows = [];
        if(this.state.isLogged){
            rows.push(<li key={"username"}><p className="navbar-text"> {this.state.user.username}</p></li>);
            rows.push(<li key={"logout"}><a href="/" onClick={this.handleLogout}><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>)
        }else{
            rows.push(<li key={"register"}><a href="/register"><span className="glyphicon glyphicon-user"></span> Register</a></li>)
            rows.push(<li key={"login"}><a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>)
        }
        return (
            <ul className="nav navbar-nav navbar-right">
                {rows}
            </ul>
        );
    }
}

$.post('api/user/get', null, function (e) {
    if(!e.data.error){
        ReactDOM.render(
            <Navbar isLogged={true} user={e.data}/>,
            document.getElementById('myNavbar')
        );
    }else{
        ReactDOM.render(
            <Navbar isLogged={false} user={null}/>,
            document.getElementById('myNavbar')
        );
    }
}, 'json');