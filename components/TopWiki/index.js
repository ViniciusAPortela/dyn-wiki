import React from 'react';
import { Box } from '@material-ui/core';
import './topwiki.css';

export default class TopWiki extends React.Component{
  render(){
    return(
      <div id='topwiki-bg'>
        <div id='topwiki-container'>
          <span id='title'>{this.props.title}</span>
          <Box id='config-row'>
            <Box id='config' boxShadow={1}></Box>
            <Box id='version' boxShadow={1} className='config-side'></Box>
            <Box id='language' boxShadow={1} className='config-side'></Box>
          </Box>
        </div>

        <Box id='feedback-col'>
          <span id='solutions-t'>Solução 1/3</span>
        </Box>
      </div>
    );
  }
}