import React from 'react';
import './content.css';

export default class Content extends React.Component{
  render(){
    return(
      <span className='content'>{this.props.children}</span>
    );
  }
}