/**
 * Created by johnla on 2016-11-24.
 */
import React from 'react';
import ReactDOM from 'react-dom';

class Warning extends React.Component {
    render(){
        return(
            <div className="alert alert-danger fade in">
                <strong>Error:</strong> {this.props.message}
            </div>
        );
    }
}

class Form extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        e.preventDefault();
        this.props.onSubmit({
            usernameemail:this.refs.useremail.value,
            password:this.refs.pwd.value
        });
    }
    render(){
        return(
            <form className="form-horizontal">
                <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="useremail" >Username or Email:</label>
                    <div className="col-sm-10">
                        <input ref="useremail" type="text" className="form-control" id="useremail" placeholder="Enter username or email" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="pwd">Password:</label>
                    <div className="col-sm-10">
                        <input ref="pwd" type="password" className="form-control" id="pwd" placeholder="Enter password" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button type="submit" className="btn btn-default" onClick={this.handleClick}>Submit</button>
                    </div>
                </div>
            </form>
        )
    }
}

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error: false,
            msg: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(data){
        var _this = this;
        $.post(
            'api/user/login',
            JSON.stringify(data),
            function (e) {
                if(!e.error){
                    createCookie("skey", e.data.sessionkey, 365);
                    window.location.href = '/';
                }else{
                    _this.setState({
                        error:true,
                        msg:e.message
                    });
                }
            }
        ,'json');
    }
    render(){
        return(
            <div className="row">
                {this.state.error && <Warning message={this.state.msg}/>}
                <Form onSubmit={this.handleSubmit} />
            </div>
        );
    }
}

ReactDOM.render(
    <Login/>,
    document.getElementById('login')
);
