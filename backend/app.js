'use strict'
var express=require('express');
var bodyParser=require('body-parser');
var morgan=require('morgan');
var app = express();
var shinykids_routes = require('./routes/shinykids');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));


//cabeceras config
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, X-Request-With, Content-Type, Accept, Access-Control-Allow,Request-Method');
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
    next();
});

app.use('/',shinykids_routes);

module.exports=app;