const express = require('express');
const next = require('next');
const fs = require('fs');

//Get NODE_ENV
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });

app.prepare().then(()=>{
    const server = express();

    //Pages
    server.get('/', (req, res) => {
        return app.render(req, res, '/wiki', req.query)
    })
    
    //All Rest
    /*server.all('*', (req, res) => {
        res.status(404);
        return app.render(req, res, '/_error', req.query)
    });*/

    server.listen(process.env.PORT || 5000, err => {
        if(err) throw err;
        console.log('Server is Up!');
    });
});