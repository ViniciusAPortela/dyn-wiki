import React from 'react';
import MDReader from '../../services/MDReader';

import { PageRender } from '../../components';

import topBg from '../../assets/page/title-bg.png';
import './wiki.css';

export default class Example extends React.Component {
  render(){
    let content = MDReader.render('update_linux');

    return(
      <div id='bg'>
        <span id='project-name'>Dyn-Wiki</span>
        <img alt='' src={topBg} id='top-bg'/>
        <PageRender content={content}/>
      </div>
    );
  }
}
