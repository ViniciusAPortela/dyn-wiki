import React from 'react';

export default class PageRender extends React.Component{
  
  /*
      Transform the Components Array in JSX to the Page
  */
  createJSX = () => {
    this.props.data.map((item, index)=>{
      
    });
  }
  
  render(){
    return(
      <>{this.createJSX()}</>
    );
  }

}