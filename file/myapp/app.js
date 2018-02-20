var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
var stock = require('./model/stock');  
mongoose.connect('mongodb://localhost/cs407');



var app = express();

//get news api
console.log("====================");
const webhoseio = require('webhoseio');


// view engine setup
app.set('view engine', 'html');
app.engine('html', require('hbs').__express); 

app.listen(8080);
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


app.use('/', index);

stock.init( function() {
   console.log('stock initializing');
});

/*
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
*/

module.exports = app;
