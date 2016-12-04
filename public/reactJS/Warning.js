/**
 * Created by johnla on 2016-11-30.
 */
import React from 'react';
export default class Warning extends React.Component {
    render(){
        return(
            <div className="alert alert-danger fade in box-pop-shadow">
                <strong>Error:</strong> {this.props.message}
            </div>
        );
    }
}