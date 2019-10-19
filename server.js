const articles = require('./services/Articles/Articles');
const express = require('express');
const next = require('next');
const fs = require('fs');

// Get NODE_ENV
const dev = process.env.NODE_ENV !== 'production'

// If is in the dev mode or production
// It is like: app = express();
const app = next({ dev });
//const handle = app.getRequestHandler();

//Execute server-side rendering
const data = articles.getArticles('./articles/');
let content = `module.exports = ` + JSON.stringify(data);
fs.writeFileSync('articles-data.js', content);

setInterval(()=>{
  console.log('updating articles');
  const data = articles.getArticles('./articles/');
  let content = `module.exports = ` + JSON.stringify(data);
  fs.writeFileSync('articles-data.js', content);
}, 10000);

app.prepare().then(()=>{
  const server = express();

  //server.use(bodyParser.json());
  //server.use(bodyParser.urlencoded({extended: true}));

  //Redirect Test
  server.get('/', (req, res) => {
    return app.render(req, res, '/', req.query)
  });

  server.get('/api', (req, res) => {
    const data = require('./constants/data');
    return res.send(data);
  });

  server.get('/articles', (req, res) => {
    const data = require('./articles-data.js');
    return res.send(data);
  });

  server.get('/wiki/:article/:version/:lang', (req, res) =>{
    //Check if exits
    fs.access(`articles/${req.params.article}/${req.params.version}/article.${req.params.lang}.md`, error => {
      if(!error){
        req.url = `/wiki/article/${req.params.article}`;
        console.log(req.url);
        console.log('ok');
        return app.render(req, res, '/wiki', {article: req.params.article, lang: req.params.lang, version: req.params.version});
      }else{
        console.log(error);
        res.status(404);
        return app.render(req, res, '/_error', req.query)
      }
    });
  });

  server.all('*', (req, res) => {
    res.status(404);
    return app.render(req, res, '/_error', req.query)
  });

  server.listen(process.env.PORT || 5000, err => {
    if(err) throw err;
    console.log('Ready on http://localhost:5000');
  })
})