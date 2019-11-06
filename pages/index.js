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
                    <div className='left-container'>
                        <img src={DynWikiLogo} className='dyn-wiki'/>
                        <div className='search'>
                            <TextField className='search-input' type="text" InputProps={{className: 'input'}}/>
                            <IconButton>
                                <Search className='search-button'/>
                            </IconButton>
                        </div>
                        <ul className='list-root'>
                        {
                            data.length !== 0 ? data.map(article =>{
                                let res = article.article;
                                return <li className='list-article'>Artigo {res}<ul>{article.versions.map(version => {
                                    let res2 = version.version;
                                    return <li>Versão {res2}<ul>{version.langs.map(lang => {
                                        return(
                                            <Link href={`/wiki/${res}/${res2}/${lang.abr}`}>
                                                <a>
                                                    <li>{lang.title} [{lang.abr}]<br/>
                                                        {lang.desc}
                                                    </li>
                                                </a>
                                            </Link>
                                        );
                                    })}</ul></li>
                                })}</ul></li>
                            })
                        : null } 
                        </ul>
                    </div>
                    <div className='right-container'>
                        <span className='category-span'>Recently Added</span>
                        <ArticleView 
                            title={ARTICLES[0].title}
                            desc={ARTICLES[0].desc}
                            lang={ARTICLES[0].lang}
                            link={ARTICLES[0].link}
                        />
                        <ArticleView 
                            title={ARTICLES[1].title}
                            desc={ARTICLES[1].desc}
                            lang={ARTICLES[1].lang}
                            link={ARTICLES[1].link}
                        />
                        
                        <span className='category-span'>Most Viewed</span>
                        <ArticleView 
                                title={ARTICLES[0].title}
                                desc={ARTICLES[0].desc}
                                lang={ARTICLES[0].lang}
                                link={ARTICLES[0].link}
                            />
                            <ArticleView 
                                title={ARTICLES[1].title}
                                desc={ARTICLES[1].desc}
                                lang={ARTICLES[1].lang}
                                link={ARTICLES[1].link}
                            />
                    </div>
                </div>
            </>
        );
    }
}