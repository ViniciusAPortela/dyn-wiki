import React from 'react';
import { Box } from '@material-ui/core';

import { TopWiki, Title, Content } from '../';

export default class PageRender extends React.Component{
  
  /*
     Transform the Components in Array to JSX in the Page
  */
  createJSX = () => {
    let content = [];

    //Create the page and put it's title
    content.push(<TopWiki title={this.props.data.title}/>);
    
    //Add Page Body
    content.push(<Box boxShadow={1} id='page'>{this.insideData(this.props.data.data)}</Box>);
    return content;
  }

  /*
      Map all elements inside Data Array
  */
  insideData = (data) => {
    let content = [];

    data.map((item)=>{
      //Get Item Type
      if(item.tag === 'title'){
        //Renders title
        content.push(<Title>{item.data}</Title>);
      }else if(item.tag === 'content'){
        //Renders the content
        content.push(<Content>{item.data}</Content>);
      }

    });

    return content;
  }

  /*
      Map inside others elements, kind of recursiviness
  */
  inside = (index) => {
    
  }
  
  render(){
    return(
      <>{this.createJSX()}</>
    );
  }

}