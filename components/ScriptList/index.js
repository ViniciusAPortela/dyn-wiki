import React from 'react';
import './scriptlist.css';

export default class ScriptList extends React.Component{
  render(){
    return(
      <div className='script-list'>{this.props.children}</div>
    );
  }
}