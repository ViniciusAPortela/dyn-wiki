import React from 'react';
import './title.css';

export default class Title extends React.Component {
  render(){
    return(
      <span className='title'>{this.props.children}</span>
    );
  }
}