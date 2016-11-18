/**
 * Created by johnla on 2016-11-17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
class Spot extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            spot: props.spot,
            isLogged:true
        };
        this.handleToggle = this.handleToggle.bind(this);
    }
    handleToggle(){
        this.state.spot.isParked = !this.state.spot.isParked;

        this.setState((oldState) => ({
            spot: oldState.spot
        }));
    }

    render(){
        return (
            <div className="col-md-6 col-sm-6 col-xs-6">
                <div className={this.state.spot.isParked ? "panel panel-danger" : "panel panel-success"}>
                    <div className="panel-heading">{this.state.spot.name}</div>
                    <div className="panel-body">{this.state.spot.isParked ? "Upptagen" : "Ledig"}</div>
                    {this.state.isLogged && <button onClick={this.handleToggle} className="btn btn-primary btn-block btn-lg">{this.state.spot.isParked ? "Lämna" : "Parkera"}</button>}
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            spots: props.spots
        };

    }
    render(){
        console.log("tjoo");
        var spots = [];
        this.state.spots.forEach(function(spot){
            spots.push(<Spot spot={spot} key={spot.id}/>);
        });
        return (
            <div className="row">
                {spots}
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
