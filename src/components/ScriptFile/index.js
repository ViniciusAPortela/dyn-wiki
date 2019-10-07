import React from 'react';
import Script from '../../assets/mime/sh.png';
import './scriptfile.css';

export default class ScriptFile extends React.Component{
  render(){
    return(
      <>
        <img alt='' src={Script} className='file'/>
      </>
    );
  }
}