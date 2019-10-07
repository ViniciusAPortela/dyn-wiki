import React from 'react';
import { Box, Divider } from '@material-ui/core';

import './example.css';
import topBg from '../../assets/page/title-bg.png';
import Title from '../../components/Title';

export default class Example extends React.Component {
  render(){
    return(
      <Box id='bg'>
        <span id='project-name'>Dyn-Wiki</span>
        <img src={topBg} id='top-bg'/>

        <Box boxShadow={1} id='page'>
          <span id='title'>Atualizando o Kernel do Linux</span>
          <Divider className='divider'/>

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

          <Title>#1 Adicionar Repositório</Title>
        </Box>
      </Box>
    );
  }
}
