/**
 * Created by johnla on 2016-11-30.
 */
import React from 'react';

class ParkingLot extends React.Component {
    render(){
        let mapUrl = "https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=640x640&scale=2&markers=color:blue%7Clabel:S|" + encodeURIComponent(this.props.lot.location) + "&key=AIzaSyD55li1OuTm-bRAzfO4Mo3AsdNKHywfp1s";
        console.log(mapUrl);
        return(
            <section style={{backgroundImage:'url(' + mapUrl + ')'}} onClick={()=>{this.props.onClick(this.props.lot)}} className={"col-md-6 col-sm-6 col-xs-12 lot"} >
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
        this.props.lots.forEach((lot) => {
            lots.push(<ParkingLot lot={lot} key={lot.id + lot.name}/>)
        });
        return(
            <div className="row no-gutter lots">
                {lots}
                {lots}
            </div>
        );
    }
}