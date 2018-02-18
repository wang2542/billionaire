var express = require('express');
var router = express.Router();
var news = require('../model/news');
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
 
  
  res.render('index-6', { title: 'Express' });
  
});

router.get('/News', function(req, res) {
  console.log("sss");
  var json;
  news.getNews(function(news){
    console.log(news);

   if(req.url!=="/favicon.ico"){
    res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"http://localhost"});
      json = JSON.stringify({ 
       title:news['posts'][0]['title'],
       image:news['posts'][0]['main_image'],
      //anArray: ["item1", "item2"], 
      //another: "item"
    });
    console.log(json.image);
   }
   res.end(json.title);
  });
 
 
});
module.exports = router;
