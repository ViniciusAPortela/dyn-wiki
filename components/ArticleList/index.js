import React, {useState, useEffect} from 'react';
import './articlelist.css';
import fetch from 'isomorphic-unfetch';
import {ArticleView} from '../';

export default function ArticleList() {
    const [ data, setData ] = useState([]);

    useEffect(async ()=>{
        //Fetch List of Articles
        let fet;
        let pre = [];
        let order = [];
        let res = [];

        '_self' in React.createElement('div') ? 
        fet = await fetch('http://'+window.location.hostname+':5000/articles') :
        fet = await fetch('http://'+window.location.hostname+'/articles');
        let data =  await fet.json();

        //Look for all articles
        data.forEach(article => {
            //Look for Versions
            article.versions.forEach(version => {
                //Look for Languages
                version.langs.forEach(lang => {
                    lang.article = article.article;
                    lang.version = version.version;
                    pre.push(lang);
                });
            });
        });

        //Order by alphabetic order
        order = pre.sort((a,b) => {
            if(a.title > b.title) return 1;
            else return -1;
        });

        //Make JSX Elements
        res.push(<span className='category-span'>All Articles</span>);
        
        let curLetter = '';
        order.forEach(element => {
            const { title, desc, abr, article, version, img } = element;

            //Check if this letter already exists
            //If not, make render letter
            if(title.substr(0, 1) !== curLetter){
                curLetter = title.substr(0, 1);
                res.push(<span className='sub-category-span'>{curLetter}</span>)
            }

            //Others Tags, in this case, just img
            let others = { article };
            if(img) others.img = img;

            res.push(
                <ArticleView
                    title={title}
                    desc={desc}
                    lang={abr}
                    link={`/wiki/${article}/${version}/${abr}`}
                    {...others}
                />
            )
        })

        console.log(order);

        //Finally Render
        setData(res);
    }, [])

    return(data);
}