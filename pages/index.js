import React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch'

export default class Index extends React.Component{
    state = {
        os: <></>,
        lang: <></>,
        arch: <></>,
        data: [],
    }

    async componentDidMount(){
        let os = this.getOS();
        let lang = navigator.language || navigator.userLanguage
        let arch = this.getArch();

        const res = await fetch('http://localhost:5000/articles');
        let data = await res.json();
        console.log('BBB: ', data);

        this.setState({os, lang, arch, data});
    }

    getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'darwin'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;
      
        if (macosPlatforms.indexOf(platform) !== -1) {
          os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
          os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
          os = 'Windows';
        } else if (/Android/.test(userAgent)) {
          os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
          os = 'Linux';
        }
      
        return os;
      }

    getArch(){
        let platform = window.navigator.platform;
        let arch64 = ['Linux x86_64','x86_64', 'x86-64', 'Win64', 'x64;', 'amd64', 'AMD64', 'WOW64', 'x64_64'];
        if(arch64.indexOf(platform) !== -1) return 'x64'; else return window.navigator.platform;
    }

    render(){
        const { data } = this.state;

        console.log(data);
        console.log(data.length !== 0);

        return(
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
                            console.log(version);
                            let res2 = version.version;
							return <li>{res2}<ul>{version.langs.map(lang => {
								console.log(lang);
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
        );
    }
}