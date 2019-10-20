import React from 'react';
import './image.css'

export default class Image extends React.Component{
  render(){
    const {src, query} = this.props;
    return(
      <div className='image-container'>
        <img className='image' src={`/articles/${query.article}/images/${src}`}/>
      </div>
    );
  }
}