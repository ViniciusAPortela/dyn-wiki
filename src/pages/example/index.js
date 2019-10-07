import React from 'react';
import { Box, Divider } from '@material-ui/core';
import './example.css';

import { 
  Title, 
  Content, 
  CommandLine, 
  Image,
  ScriptList,
  ScriptFile,
  TopWiki,
} from '../../components/index.js';
import { Data } from '../../constants';
import topBg from '../../assets/page/title-bg.png';

export default class Example extends React.Component {
  render(){
    return(
      <Box id='bg'>
        <span id='project-name'>Dyn-Wiki</span>
        <img alt='' src={topBg} id='top-bg'/>

        <Box boxShadow={1} id='page'>
          <TopWiki/>

          <Title>#1 Adicionar Repositório</Title>
          <Content>{Data.t1}</Content>
          <CommandLine>{Data.c1}</CommandLine>
          <CommandLine>{Data.c2}</CommandLine>


          <Title>#2 Instalar ukuu</Title>
          <CommandLine>{Data.c3}</CommandLine>


          <Title>#3 Escolher Versão e Instalar</Title>
          <Image/>
          <Content>{Data.t2}</Content>


          <Title>#Scripts</Title>
          <ScriptList>
            <ScriptFile/>
            <ScriptFile/>
            <ScriptFile/>
          </ScriptList>

          <Title>#Perguntas Frequentes</Title>

        </Box>
      </Box>
    );
  }
}
