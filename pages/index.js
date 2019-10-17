import React from 'react';
import Link from 'next/link';

export default class Index extends React.Component{
    static async getInitialProps(){
        const articles = require('../services/Articles/Articles');
        const data = articles.getArticles('articles/');
        return { data };
    }

    render(){
        const { data } = this.props;
        return(
            <div>
                <h1>Dyn-Wiki - A dynamic Wiki for easy reading</h1>
				Artigos:
                <ul>
                {
                    data.map(article =>{
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
                }
                </ul>
            </div>
        );
    }
}