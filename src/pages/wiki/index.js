import React from 'react';

import { PageRender } from '../../components';
import Data from '../../services/data';

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
