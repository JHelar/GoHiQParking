/**
 * Created by johnla on 2016-11-17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import EventController from './EventController';
import Warning from './Warning';
import Parkinglots, {LotChooseButton} from './Parkinglots';


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
                <div className={"panel spot " + (this.props.spot.isparked ? "panel-danger" : "panel-success")}>
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
        if(this.props.lot !== null) {
            this.props.lot.spots.forEach(function (spot) {
                spots.push(<Spot spot={spot} onToggle={_this.props.onToggle}
                                 key={spot.id + spot.isparked.toString()}/>);
            });
        }
        return(
            <div className="spots container flex center-center">
                {this.props.children}
                <div className="row" style={{width:'100%'}}>{spots}</div>
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
            lot:props.lot,
            error: false,
            message:"",
            showLots:props.showLots
        };


        this.handleSpotToggle = this.handleSpotToggle.bind(this);
        this.handleStream = this.handleStream.bind(this);
        this._updateSpots = this._updateSpots.bind(this);
    }

    _updateSpots(lot) {
        console.log("PRINT");
        let _this = this;
        let data = null;
        if(lot !== null && lot !== undefined){
            data = JSON.stringify(lot);
            createCookie("lotDefault", btoa(data), 14);
        }else{
            this.state.lot.spots = null;
            data = JSON.stringify(this.state.lot);
        }
        $.post('/api/lot/fill', data, function (e) {
            if(!e.error) {
                _this.setState({
                    lot: e.data,
                    showLots:false
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
        //let showLots = this.state.lot === null || this.state.lot === undefined;
        let bgImg = this.state.lot !== null ? 'url(' + getGoogleStaticMap(this.state.lot.location) + ')' : 'none';
        return (
            <div className={"cover-image " + (this.state.showLots ? "" : "map-show")} style={{backgroundImage:bgImg}}>
                <Parkinglots lots={this.props.lots} show={this.state.showLots} onClick={this._updateSpots}/>
                <Spots lot={this.state.lot} onToggle={this.handleSpotToggle}>
                    <LotChooseButton onToggle={()=>{this.setState({showLots:true})}}/>
                    {this.state.error && <Warning message={this.state.message}/>}
                </Spots>
                {this.state.lot !== null & !this.state.showLots && <EventController eventType={'update' + this.state.lot.id} onEvent={this.handleStream}/>}
            </div>

        );
    }
}
$.post('/api/lot/getAll', null, function(lots){
    let defaultLot64 = getCookie("lotDefault");
    if(defaultLot64 !== null){
        //Load default lot, decode string.
        let defaultLotJson = atob(defaultLot64);
        $.post('/api/lot/fill', defaultLotJson, function (lot) {
            if(!lot.error) {
                ReactDOM.render(
                    <App lots={lots.data} lot={lot.data} showLots={false}/>,
                    document.getElementById("spots")
                );
            }else{
                ReactDOM.render(
                    <App lots={lots.data} lot={null} showLots={true}/>,
                    document.getElementById("spots")
                );
            }
        }, 'json');
    }else{
        ReactDOM.render(
            <App lots={lots.data} lot={null} showLots={true}/>,
            document.getElementById("spots")
        );
    }

},'json');
