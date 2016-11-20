/**
 * Created by johnla on 2016-11-17.
 */
import React from 'react';
import ReactDOM from 'react-dom';

//ToDo: Fix datetime show.
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
        var data = {
            id: this.state.spot.id
        };
        var _this = this;
        $.post('/api/spot/toggle', JSON.stringify(data), function (e) {
            if(!e.data.error){
                document.getElementById('warning').innerHTML = "";
                _this.setState({
                    spot:e.data
                });
            }else{
                document.getElementById('warning').innerHTML = e.data.message;
            }
        }, 'json');
        this.setState((oldState) => ({
            spot: oldState.spot
        }));
    }

    render(){
        return (
            <div className="col-md-6 col-sm-6 col-xs-6">
                <div className={this.state.spot.isparked ? "panel panel-danger" : "panel panel-success"}>
                    <div className="panel-heading">{this.state.spot.name}</div>
                    <div className="panel-body">{this.state.spot.isparked ? "Upptagen" : "Ledig"}</div>
                    {this.state.spot.canmodify && <button onClick={this.handleToggle} className="btn btn-primary btn-block btn-lg">{this.state.spot.isparked ? "Lämna" : "Parkera"}</button>}
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
            spots: props.spots
        };

    }
    render(){
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
