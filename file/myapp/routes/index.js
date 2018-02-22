var express = require('express');
var router = express.Router();
var news = require('../model/news.js');
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  news.getNews(function(result){
  	//var json = JSON.parse(result['posts'][0]);
  	console.log('lllllll');

  	console.log(result['posts'][0]['title']);
  	res.render('index-6', {
    title : result['posts'][0]['title'],
 		});
 	 });
});
 
router.post('/', function(req, res, next){
	console.log('search course');
	//console.log(req.body.coursename);
	stockInfo.searchStockBySymbl(req.body.stockName, function(err, infom) {
		if (err) {
			//res.redirect('/error');
		}
		else {
		//	localStorage.setItem('Course',JSON.stringify(course));
			res.redirect('/stock');
		}
	});
	
});



module.exports = router;
