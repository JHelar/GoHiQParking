/**
 * Created by johnla on 2016-11-17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import EventController from './EventController';
import Warning from './Warning';
import Parkinglots from './Parkinglots';


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
            <div className="col-md-6 col-sm-6 col-xs-12">
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
            message:""
        };
        this.handleSpotToggle = this.handleSpotToggle.bind(this);
        this.handleStream = this.handleStream.bind(this);
        this._updateSpots = this._updateSpots.bind(this);
    }
    _updateSpots() {
        let _this = this;
        $.post('/api/spot/getAll', null, function (e) {
            _this.setState({
                spots:e.data
            });
        }, 'json');
    }
    handleStream(data){
        if(data.message === 'UPDATE'){
            this._updateSpots();
        }
    }
    handleSpotToggle(spot){
        var _this = this;
        $.post('/api/spot/toggle', JSON.stringify({id:spot.id}), function (e) {
            if(!e.error){
                _this.setState({
                    spots:e.data,
                    error:false
                });
            }else{
                _this.setState({
                    error: true,
                    message: e.message
                });
            }
        }, 'json');
    }
    render(){
        var spots = [];
        var _this = this;
        /*this.state.spots.forEach(function(spot){
            spots.push(<Spot spot={spot} onToggle={_this.handleSpotToggle} key={spot.id + spot.isparked.toString()}/>);
        });*/
        return (
            <div className="cover-white flex center-center">
                <div className="container">
                    <Parkinglots lots={this.props.lots}/>
                </div>
            </div>
        );
    }
}

$.post('/api/lot/getAll', null, function(e){
    ReactDOM.render(
        <App lots={e.data}/>,
        document.getElementById("spots")
    );
},'json');
