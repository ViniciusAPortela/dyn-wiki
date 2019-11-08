import React from 'react';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import { IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import userConfig from '../services/UserConfig';
import { ArticleList } from '../components';
import './index.css';

export default class Index extends React.Component{
    state = {
        os: <></>,
        lang: <></>,
        arch: <></>,
        data: [],
    }

    async componentDidMount(){
        let os = userConfig.getOS();
        let lang = userConfig.getLang();
        let arch = userConfig.getArch();
        let res = [];

        //Check if is in development or production
        '_self' in React.createElement('div') ? 
        res = await fetch('http://'+window.location.hostname+':5000/articles') :
        res = await fetch('http://'+window.location.hostname+'/articles');

        let data = await res.json();

        this.setState({os, lang, arch, data});
    }

    render(){
        const { data } = this.state;

        return(
            <>
                <Head>
                    <title>Dyn-Wiki - A dynamic Wiki for easy reading</title>
                </Head>
                <div className='root-container'>
                    <div className='top-container'>
                        <span className='top-dynwiki'>Dyn-Wiki</span>
                        <div className='top-input'>
                            <div className='input-container'>
                                <input type='text' className='top-input-field'/>
                            </div>
                            <IconButton>
                                <Search className='input-search'/>
                            </IconButton>
                        </div>
                    </div>
                    <div className='bottom-container'>
                        { <ArticleList/> }
                    </div>
                </div>
            </>
        );
    }
}