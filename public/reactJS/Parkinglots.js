/**
 * Created by johnla on 2016-11-30.
 */
import React from 'react';


export class LotChooseButton extends React.Component {
    render(){
        return(
            <div className="lot-choose-btn">
                <button onClick={this.props.onToggle} className={"btn btn-primary btn-block btn-lg"}>Choose parking lot</button>
            </div>
        );
    }
}

class ParkingLot extends React.Component {
    render(){
        let mapUrl = getGoogleStaticMap(this.props.lot.location);
        console.log(mapUrl);
        return(
            <section style={{backgroundImage:'url(' + mapUrl + ')'}} onClick={()=>{this.props.onClick(this.props.lot)}} className={"lot"} >
                <span className="lot-name">
                    <h1>{this.props.lot.name}</h1>
                </span>
            </section>
        );
    }
}

export default class Parkinglots extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let lots = [];
        let _this = this;
        this.props.lots.forEach((lot) => {
            lots.push(<ParkingLot lot={lot} key={lot.id + lot.name} onClick={_this.props.onClick}/>)
        });
        return(
            <div className="container no-gutter">
                <div className={"lots " + (this.props.show ? "" : "hide-dem")}>
                {lots}
                </div>
            </div>
        );
    }
}