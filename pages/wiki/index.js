import React from 'react';
import Head from 'next/head';

import { PageRender } from '../../components';
import articles from '../../services/Articles/Articles';

import topBg from '../../assets/page/title-bg.png';
import './wiki.css';

export default class Wiki extends React.Component {
  static getInitialProps({query}){
    //Get content of requested article
    const reader = require('../../services/MDReader/MDReader');

    const userConfig = require('../../services/MDReader/userConfig.js');
    const file = `articles/${query.article}/${query.version}/article.${query.lang}.md`;
    
    const data = reader.convert(file, userConfig);
    const versions = articles.getVersions(`articles/${query.article}/`);
    const langs = articles.getLangs(`articles/${query.article}/${query.version}/`);

    data.versions = versions;
    data.langs = langs; 

    console.log(versions, langs);

    return{ data, query }
  }

  render(){
    const { data, query } = this.props;
    return(
      <>
        <Head>
          <title>{data.title}</title>
        </Head>
        <div id='bg'>
          <a href="/">
            <span id='project-name'>Dyn-Wiki</span>
          </a>
          <img alt='' src={topBg} id='top-bg'/>
          <PageRender data={data} query={query}/>
        </div>
      </>
    );
  }
}
