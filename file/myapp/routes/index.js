var express = require('express');
var router = express.Router();
var news = require('../model/news.js');
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("sss");
  //console.log(news.value);
  
  
});

router.get('/news', function(req, res) {

 
});
 
 
module.exports = router;
