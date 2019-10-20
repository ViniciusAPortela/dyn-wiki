const articles = require('./services/Articles/Articles');
const express = require('express');
const next = require('next');
const fs = require('fs');
const yaml = require('js-yaml');

// Get NODE_ENV
const dev = process.env.NODE_ENV !== 'production'

// If is in the dev mode or production
// It is like: app = express();
const app = next({ dev });
//const handle = app.getRequestHandler();

//Get Server Config
let config = yaml.safeLoad(fs.readFileSync('./config/server.yml', 'utf8'));

//Execute server-side rendering
setInterval(()=>{
  console.log('Updating Articles...');
  let updated_data = articles.getArticles('./articles/');
  let updated_content = JSON.stringify(updated_data);
  fs.writeFile('articles-data.js', updated_content, {flag: 'w'}, (err)=>{
    if(err) throw error;
  });
}, config.updateArticleList);

app.prepare().then(()=>{
  const server = express();

  //Root Page
  server.get('/', (req, res) => {
    return app.render(req, res, '/', req.query)
  });

  //Favicon
  server.get('/favicon.ico', (req, res) => {
    res.contentType('image/jpeg');
    const data = fs.readFileSync('./favicon.ico');
    return res.send(data);
  });

  //Api for getting static data
  server.get('/api', (req, res) => {
    const data = require('./constants/data');
    return res.send(data);
  });

  //Api for getting image
  server.get('/articles/:article/images/:img', (req, res) =>{
    res.contentType('image/jpeg');
    let file = `articles/${req.params.article}/images/${req.params.img}`;
    const data = fs.readFileSync(file);
    return res.send(data);
  });

  //Api for getting list of articles
  server.get('/articles', (req, res) => {
    fs.readFile("articles-data.js", "utf8", function(err, data){
        if(err) throw err;
        res.send(data);
    });
  });

  //Wiki
  server.get('/wiki/:article/:version/:lang', (req, res) =>{
    //Check if exits
    fs.access(`articles/${req.params.article}/${req.params.version}/article.${req.params.lang}.md`, error => {
      if(!error){
        req.url = `/wiki/article/${req.params.article}`;
        return app.render(req, res, '/wiki', {article: req.params.article, lang: req.params.lang, version: req.params.version});
      }else{
        console.log(error);
        res.status(404);
        return app.render(req, res, '/_error', req.query)
      }
    });
  });

  //Others (404)
  server.all('*', (req, res) => {
    res.status(404);
    return app.render(req, res, '/_error', req.query)
    //return handle(req, res, req.query);
  });

  server.listen(process.env.PORT || 5000, err => {
    if(err) throw err;
    console.log('✔️  Server is Ready an running on port:', process.env.PORT || 5000);
  })
})