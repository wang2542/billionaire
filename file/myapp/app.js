var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var my_str;
const webhoseio = require('webhoseio');
const client = webhoseio.config({token: '3deda486-162a-4e74-bdd8-004b8b323ff4'});
  const query_params = {
  "q": "\"stock\" language:english",
  "sort": "crawled"
    }
    client.query('filterWebContent', query_params)
    .then(output => {
        my_str = output['posts'][0]['text'];
        //console.log(output['posts'][0]['text']); // Print the text of the first post
        //console.log(output['posts'][0]['published']); // Print the text of the first post publication date
        console.log("=========");
        console.log(my_str);
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Store all JS and Css in Public folder
app.use(express.static(path.join(__dirname, 'public')));
// Store all HTML files in view folder.
app.use(express.static(path.join(__dirname, 'views')));

//app.use('/', index);
//app.use('/users', users);
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/index-6.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
