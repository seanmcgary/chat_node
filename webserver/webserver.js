/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 11/7/11
 * Time: 11:24 PM
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var http = require('http');
var path = require('path');
/*var express = require('express');

var app = express.createServer();

app.use(express.cookieParser());
app.use(express.session({secret: "cockboat"}));
app.use(express.bodyParser());

app.get('/', function(req, res){
    console.log(req);
    var index = fs.readFileSync('www/index.html').toString();
    //console.log(index);

    res.send(index);
});

app.listen(8080);*/

var app = http.createServer();

app.on('request', function(req, res){
    var request = req.url;
    //console.log(req);
    //console.log(request);

    if(request = '/'){
        request = '/index.html';
    }

    var file = './www' + request;

    var content_type = 'text/html';

    var extension = path.extname(file);

    switch(extension){
        case 'js':
            content_type = 'text/javascript';
            break;
        case 'css':
            content_type = 'text/css'
            break;
    }

    path.exists(file, function(exists){
        if(exists){
            fs.readFile(file, function(error, content){

                if(error){
                    res.writeHead(500);
                    res.end();
                } else {
                    console.log(file);
                    content = content.toString();
                    console.log(content);
                    res.writeHead(200, {'Content-Type': content_type});
                    res.end(content, 'utf-8');
                }
            })
        }
    })



});

app.listen(8080);


