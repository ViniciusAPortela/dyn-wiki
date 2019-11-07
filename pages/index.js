import React from 'react'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import { TextField, IconButton } from '@material-ui/core'
import { Search } from '@material-ui/icons'

import userConfig from '../services/UserConfig'
import DynWikiLogo from '../assets/icons/dynwiki.png'
import { ArticleView } from '../components'
import { ARTICLES } from '../constants'
import './index.css'

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
                        <span className='category-span'>All Articles</span>
                        <span className='sub-category-span'>C</span>
                        <ArticleView
                            title={ARTICLES[1].title}
                            desc={ARTICLES[1].desc}
                            lang={ARTICLES[1].lang}
                            link={ARTICLES[1].link}
                            {...ARTICLES[1]}
                        />
                        <span className='sub-category-span'>H</span>
                        <ArticleView
                            title={ARTICLES[0].title}
                            desc={ARTICLES[0].desc}
                            lang={ARTICLES[0].lang}
                            link={ARTICLES[0].link}
                            img={ARTICLES[0].article_image}
                            {...ARTICLES[0]}
                        />
                    </div>
                </div>
            </>
        );
    }
}