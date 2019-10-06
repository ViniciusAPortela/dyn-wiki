import React from 'react';
import { Box, Divider } from '@material-ui/core';
import './example.css';

export default class Example extends React.Component {
  render(){
    return(
      <Box id='bg'>
        <Box boxShadow={1} id='page'>
          <span id='title'>Example Page</span>
          <Divider className='divider'/>

          <Box id='config-row'>
            <Box id='config'></Box>
            <Box id='version' className='config-side'></Box>
            <Box id='language' className='config-side'></Box>
          </Box>
        </Box>
      </Box>
    );
  }
}
