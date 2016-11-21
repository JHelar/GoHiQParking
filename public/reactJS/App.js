/**
 * Created by johnla on 2016-11-17.
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

//ToDo: Fix datetime show.
class Spot extends React.Component{
    constructor(props){
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
    }
    handleToggle(){
        this.props.onToggle(this.props.spot)
    }

    render(){
        var btnClasses = this.props.spot.canmodify ? "btn btn-primary btn-block btn-lg" : "btn btn-primary btn-block btn-lg disabled";
        var time = timeDifference(new Date(this.props.spot.parkedtime));
        var bodyStr = this.props.spot.isparked ? (<span>Parked: <strong>{time}</strong><br/>Parked by: <strong>{this.props.spot.parkedby}</strong></span>):("Ledig");
        return (
            <div className="col-md-6 col-sm-6 col-xs-6">
                <div className={this.props.spot.isparked ? "panel panel-danger" : "panel panel-success"}>
                    <div className="panel-heading">{this.props.spot.name}</div>
                    <div className="panel-body">
                        {bodyStr}
                    </div>
                    <button onClick={this.handleToggle} className={btnClasses}>{this.props.spot.isparked ? "Lämna" : "Parkera"}</button>
                </div>
            </div>
        );
    }
}

//ToDO: Fix the spot toggle.
class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            spots: props.spots,
            error: false,
            message:"",
        };
        this.handleSpotToggle = this.handleSpotToggle.bind(this);

    }
    handleSpotToggle(spot){
        var _this = this;
        $.post('/api/spot/toggle', JSON.stringify({id:spot.id}), function (e) {
            if(!e.data.error){
                _this.setState({
                    spots:e.data,
                    error:false
                });
            }else{
                _this.setState({
                    error: true,
                    message: e.data.message
                });
            }
        }, 'json');
    }
    render(){
        var spots = [];
        var _this = this;
        this.state.spots.forEach(function(spot){
            spots.push(<Spot spot={spot} onToggle={_this.handleSpotToggle} key={spot.id + spot.isparked.toString()}/>);
        });
        return (
            <div className="clearfix">
                {this.state.error &&
                <div className="row container">
                    <Warning message={this.state.message}/>
                </div>}
                <div className="row">
                    {spots}
                </div>
            </div>
        );
    }
}

$.post('/api/spot/getAll', null, function(e){
    ReactDOM.render(
        <App spots={e.data}/>,
        document.getElementById("spots")
    );
},'json');
