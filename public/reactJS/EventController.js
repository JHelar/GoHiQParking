/**
 * Created by johnla on 2016-11-28.
 */
import React from 'react';

export default class EventController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            stream:null
        };
        this.handleStream = this.handleStream.bind(this);
    }
    handleStream(e){
        /*console.log('-----------GOT DATA----------');
        console.log(e.data);
        console.log('-----------END---------------');*/
        let data = JSON.parse(e.data);

        if(!data.error){
            //Send to app.
            console.log(data.error);
            this.props.onEvent(data);
        }else{
            console.log("Event error: " + data.message);
        }
    }
    componentDidMount(){
        this.state.stream = new EventSource("/event/spot");
        this.state.stream.addEventListener(this.props.eventType !== null && this.props.eventType !== undefined ? this.props.eventType : 'message', this.handleStream, false);
    }
    componentWillUnmount(){
        this.state.stream.removeEventListener(this.props.eventType !== null && this.props.eventType !== undefined ? this.props.eventType : 'message');
        this.state.stream.close();
    }
    render(){
        return null;
    }
}