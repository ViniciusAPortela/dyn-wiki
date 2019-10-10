import React from 'react';
import MDReader from '../../services/MDReader';

import { PageRender } from '../../components';
import { Data } from '../../constants/';

import topBg from '../../assets/page/title-bg.png';
import './wiki.css';

export default class Example extends React.Component {
  render(){
    return(
      <div id='bg'>
        <span id='project-name'>Dyn-Wiki</span>
        <img alt='' src={topBg} id='top-bg'/>
        <PageRender data={Data}/>
      </div>
    );
  }
}
