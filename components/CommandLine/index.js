import React from 'react';
import { BasicSnackbar } from '../../components';

import copyToClip from '../../services/CopyToClipboard';
import Copy from '../../assets/icons/copy.png';
import './commandline.css';

export default class CommandLine extends React.Component{
  state = {
    open: false
  }

  changeOpen = (open) => {
    this.setState({open});
  }

  render(){
    return(
      <div className='command-container'>
        <div className='cmd-left'>
          <span>{this.props.sudo && <span className='cmd-sudo'>sudo</span>} {this.props.children}</span>
        </div>
        <div className='cmd-right'>
          <img className='cmd-copy' src={Copy} onClick={()=>{copyToClip(((this.props.sudo)?'sudo ':'')+this.props.children, this.changeOpen)}}/>
        </div>
        <BasicSnackbar content='Copied to Clipboard' opened={this.state.open} changeOpen={this.changeOpen}/>
      </div>
    );
  }
}