import React from 'react';
import { Box } from '@material-ui/core';
import './topwiki.css';

export default class TopWiki extends React.Component{
  render(){
    return(
      <>
        <span id='title'>Atualizando o Kernel do Linux</span>

        <Box id='config-row'>
          <Box id='config'></Box>
          <Box id='version' className='config-side'></Box>
          <Box id='language' className='config-side'></Box>
        </Box>

        <Box id='feedback-col'>
          <span id='solutions-t'>Solução 1/3</span>
          <Box></Box>
        </Box>

        <Box id='feedback-space'/>
      </>
    );
  }
}