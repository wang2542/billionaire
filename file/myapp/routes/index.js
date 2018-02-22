var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var news = require('../model/news.js');
//var localStorage = require('localStorage');

var stockInfo = require('../model/stockInfo');
var User = require('../model/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  	news.getNews(function(result){
	  	//var json = JSON.parse(result['posts'][0]);
	  	console.log('lllllll');

	  	console.log(result['posts'][0]['title']);
	  	console.log(result['posts'][0]['text']);
	  	if (!req.user) {
		  	res.render('index-6', {
		    	title : result['posts'][0]['title'],
		    	text : result['posts'][0]['text'],
		 	});	
	  	} else {
	  		res.render('index-6', {
	  			title : result['posts'][0]['title'],
		    	text : result['posts'][0]['text'],
				username: req.user.username
			});
	  	}
 	});
});


router.post('/', function(req, res, next){
	console.log('search stock');
	console.log(req.body.stockName);
	stockInfo.searchStockByName(req.body.stockName, function(err, infom) {

		if (err) {
			//res.redirect('/error');
		}
		else {
			console.log(infom);
      res.redirect('/stock');
      
		}
	});
});

module.exports = router;
