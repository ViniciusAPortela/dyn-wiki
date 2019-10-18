import React from 'react';
import './commandline.css';

export default class CommandLine extends React.Component{
  render(){
    return(
      <div className='command-container'><span>{this.props.sudo?<span className='cmd-sudo'>sudo</span>:''} {this.props.children}</span></div>
    );
  }
}