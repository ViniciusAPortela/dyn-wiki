import React from 'react';

export default class Content extends React.Component{
  render(){
    return(
      <span>{this.props.children}</span>
    );
  }
}