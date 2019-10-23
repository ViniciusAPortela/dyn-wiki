import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

import { PageRender } from '../../components';

import topBg from '../../assets/page/title-bg.png';
import './wiki.css';

export default class Wiki extends React.Component {
  static getInitialProps({query}){
    return { query };
  }

  state = {
    data: {}
  }

  async componentDidMount(){
    //Load Article Body
    const { article, version, lang } = this.props.query;
    let res = await fetch(`/api/article/?article=${article}&version=${version}&lang=${lang}`);
    let data = await res.json();

    this.setState({data});
  }

  render(){
    const query = this.props.query;
    const { data } = this.state;
    
    const loaded = Object.keys(data).length > 0;

    return(
      <>
        <Head>
          <title>{loaded && data.title}</title>
        </Head>
        <div id='bg'>
          <Link href="/">
            <a>
              <span id='project-name'>{'< '}Dyn-Wiki</span>
            </a>
          </Link>
          <img alt='' src={topBg} id='top-bg'/>
          {loaded && <PageRender data={data} query={query}/>}
        </div>
      </>
    );
  }
}
