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

class Spots extends React.Component {
    render(){
        let _this = this;
        let spots = [];
        this.props.spots.forEach(function(spot){
            spots.push(<Spot spot={spot} onToggle={_this.props.onToggle} key={spot.id + spot.isparked.toString()}/>);
        });
        return(
            <div className="cover-white flex center-center">
                <div className="container">
                    {spots}
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
            spots: null,
            lot:null,
            error: false,
            message:""
        };
        this.handleSpotToggle = this.handleSpotToggle.bind(this);
        this.handleStream = this.handleStream.bind(this);
        this._updateSpots = this._updateSpots.bind(this);
    }
    _updateSpots(lot) {
        let _this = this;
        let data = null;
        if(lot !== null && lot !== undefined){
            data = JSON.stringify(lot);
        }else{
            data = JSON.stringify(this.state.lot);
        }
        $.post('/api/lot/fill', data, function (e) {
            if(!e.error) {
                _this.setState({
                    lot: e.data
                });
            }
        }, 'json');
    }
    handleStream(data){
        if(data.message === 'UPDATE'){
            this._updateSpots();
        }
    }
    handleSpotToggle(spot){
        let _this = this;
        $.post('/api/spot/toggle', JSON.stringify({id:spot.id}), function (e) {
            if(!e.error){
                let lot = _this.state.lot;
                lot.spots = e.data;
                _this.setState({
                    lot:lot,
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
        let showLots = this.state.lot === null || this.state.lot === undefined;
        return (
            <div>
                {this.state.error && <Warning message={this.state.message}/>}
                {showLots && <Parkinglots lots={this.props.lots} onClick={this._updateSpots}/>}
                {!showLots && <Spots spots={this.state.lot.spots} onToggle={this.handleSpotToggle}/>}
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
