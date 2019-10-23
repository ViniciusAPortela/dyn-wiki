import React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch'
import Head from 'next/head';
import userConfig from '../services/UserConfig';

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

        //const res = await fetch('http://'+window.location.hostname+'/articles');
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
                <div>
                    <h1>Dyn-Wiki - A dynamic Wiki for easy reading</h1>
                    Dados pelo Navegador:<br/>
                    Sistema Operacional: {this.state.os}<br/>
                    Idioma: {this.state.lang}<br/>
                    Arquitetura: {this.state.arch}
                    <br/><br/>
                    Artigos:
                    <ul>
                    {
                        data.length !== 0 ? data.map(article =>{
                            let res = article.article;
                            return <li>{res}<ul>{article.versions.map(version => {
                                let res2 = version.version;
                                return <li>{res2}<ul>{version.langs.map(lang => {
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
            </>
        );
    }
}