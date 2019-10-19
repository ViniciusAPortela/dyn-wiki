import React from 'react';
import { Box, Button } from '@material-ui/core';
import { Dropdown } from '../../components';

import './topwiki.css';

export default class TopWiki extends React.Component{
  state = {
    versions: [],
    langs: [],
  }

  componentDidMount(){
    let versions = this.props.data.versions;
    let langs = this.props.data.langs;

    this.setState({versions, langs});
  }

  render(){
    return(
      <div id='topwiki-bg'>
        <div id='topwiki-container'>
          <span id='title'>{this.props.title}</span>
          <Box id='config-row'>
            <Button id='config'></Button>
            <Dropdown className='config-side' id='version' title='1.0'></Dropdown>
            <Dropdown className='config-side' id='language' title='PT'></Dropdown>
          </Box>
        </div>

        <Box id='feedback-col'>
          <span id='solutions-t'>Solução 1/3</span>
        </Box>
      </div>
    );
  }
}