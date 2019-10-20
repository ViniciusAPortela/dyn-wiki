import React from 'react';
import { Box } from '@material-ui/core';

import { TopWiki, Title, Content, CommandLine, ScriptList, ScriptFile, BottomWiki, Image } from '../';

export default class PageRender extends React.Component{
  
  /**
   *  Transform the Components in Array to JSX in the Page
   */
  createJSX = () => {
    let content = [];

    //Create the page and put it's title
    content.push(<TopWiki query={this.props.query} data={this.props.data} title={this.props.data.title}/>);
    
    //Add Page Body
    content.push(<Box boxShadow={1} id='page'>{this.inside(this.props.data)}</Box>);

    //Add Bottom Page
    content.push(<BottomWiki/>);
    return content;
  }

  /** 
   *   Identify the object and return it
   */
  getType(item){
    if(item.tag === 'title'){
      //Renders title
      return <Title>{item.data}</Title>
    }else if(item.tag === 'content'){
      //Renders the content
      return <Content>{item.data}</Content>
    }else if(item.tag === 'command'){
      //Renders the CommandLine With/Without the Sudo Preffix
      return <CommandLine sudo={item.sudo}>{item.data}</CommandLine>
    }else if(item.tag === 'image'){
      //Renders a Image
      return <Image query={this.props.query} src={item.src}/>
    }else if(item.tag === 'scripts'){
      //Renders the Script List
      return <ScriptList>{this.inside(item)}</ScriptList>
    }else if(item.tag === 'script-file'){
      //Renders the Script File
      return <ScriptFile query={this.props.query} src={item.src} name={item.name}/>
    }
  }

  /**
   * Map inside others elements, kind of recursiviness
   */
  inside = (array) => {
    let content = [];

    array.data.map((item)=>{
      content.push(this.getType(item));
    });

    return content;
  }
  
  render(){
    return(
      <>{this.createJSX()}</>
    );
  }

}