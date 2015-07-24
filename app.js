var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var instagram = require('./instagram');
var app = express();

/* App setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Include our instagram module */
app.use('/', instagram);

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function (){
    console.log('Starting server on ' + server.address().port);
});

module.exports = app;
