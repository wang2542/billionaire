var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var news


//get news api
const webhoseio = require('webhoseio');
const client = webhoseio.config({token: 'cf0134db-bd58-480c-b9ab-2aa7e552dab5'});
const query_params = {
  "q": "“stocks” language:english rating:>4",
  "sort": "crawled"
}
client.query('filterWebContent', query_params)
  .then(output => {
    news = output;
    console.log(news);
    //console.log(output['posts'][0]['title']); // Print the text of the first post
    console.log(output['posts'][0]['published']); // Print the text of the first post publication date
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


app.get('/News', function(req, res) {
    console.log("sss");
    if(req.url!=="/favicon.ico"){
        res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"http://localhost"});
        var json = JSON.stringify({ 
           title:news['posts'][0]['title'],
           image:news['posts'][0]['main_image'],
          //anArray: ["item1", "item2"], 
          //another: "item"
        });
        console.log(json.image);
    }
    res.end(json);
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
