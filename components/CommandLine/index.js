import React from 'react';
import Copy from '../../assets/icons/copy.png';
import './commandline.css';
import copyToClip from '../../services/CopyToClipboard';

export default class CommandLine extends React.Component{
  render(){
    return(
      <div className='command-container'>
        <div className='cmd-left'>
          <span>{this.props.sudo?<span className='cmd-sudo'>sudo</span>:''} {this.props.children}</span>
        </div>
        <div className='cmd-right'>
          <img className='cmd-copy' src={Copy} onClick={()=>{copyToClip(((this.props.sudo)?'sudo ':null)+this.props.children)}}/>
        </div>
      </div>
    );
  }
}