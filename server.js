const express = require('express');
const next = require('next');
const fs = require('fs');
//var bodyParser = require('body-parser');

// Get NODE_ENV
const dev = process.env.NODE_ENV !== 'production'

// If is in the dev mode or production
// It is like: app = express();
const app = next({ dev });
//const handle = app.getRequestHandler();

app.prepare().then(()=>{
  const server = express();

  //server.use(bodyParser.json());
  //server.use(bodyParser.urlencoded({extended: true}));

  //Redirect Test
  server.get('/wiki', (req, res) => {
    return app.render(req, res, '/wiki', req.query)
  });

  server.get('/', (req, res) => {
    return app.render(req, res, '/index', req.query)
  });

  /*server.get('/getApi', (req, res) => {
    return app.render(req, res, '/getApi', req.query)
  });

  server.get('/google3af1ff7b04f1bf61.html', (req, res) => {
    fs.readFile('/google3af1ff7b04f1bf61.html', 'utf8', (err, text) => {
        res.send(text);
    });
  });

  server.get('/api', (req, res) => {
    const data = require('./data');
    return res.send(data);
  });

  server.get('/wiki/:article/:version/:lang', (req, res) =>{
    //Check if exits
    fs.access(`articles/${req.params.article}/${req.params.version}/article.${req.params.lang}.md`, error => {
      if(!error){
        //Exits, Check if Lang Version Exists
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
  });*/

  server.all('*', (req, res) => {
    res.status(404);
    return app.render(req, res, '/_error', req.query)
  });

  server.listen(process.env.PORT || 5000, err => {
    if(err) throw err;
    console.log('Ready on http://localhost:5000');
  })
})