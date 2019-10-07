import React from 'react';
import './commandline.css';

export default class CommandLine extends React.Component{
  render(){
    return(
      <div className='command-container'>{this.props.children}</div>
    );
  }
}