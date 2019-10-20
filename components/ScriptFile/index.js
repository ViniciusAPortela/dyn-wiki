import React from 'react';
import Script from '../../assets/mime/sh.png';
import './scriptfile.css';

export default class ScriptFile extends React.Component{
  render(){
    const {name, query, src} = this.props;
    return(
      <div className='file-container'>
        <a href={`/articles/${query.article}/files/${src}`} download={name}>
          <img  alt={name} src={Script} className='file'/>
        </a>
        <span className='file-name'>{name}</span>
      </div>
    );
  }
}