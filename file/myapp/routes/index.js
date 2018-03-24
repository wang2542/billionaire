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
	  	//console.log(result);

	  	//console.log(result['posts'][0]['title']);
	  	//console.log(result['posts'][0]['text']);
	  	//console.log(result['posts'][0]['url']);
	  	if (!req.user) {
		  	res.render('index-6', {
		    	title_1 : result['posts'][0]['title'],
		    	url_1 : result['posts'][0]['url'],
		    	author_1 : result['posts'][0]['author'],
		    	title_2 : result['posts'][1]['title'],
		    	url_2 : result['posts'][1]['url'],
		    	author_2 : result['posts'][1]['author']
		 	});	
	  	} else {
	  		res.render('index-6', {
	  			title_1 : result['posts'][0]['title'],
		    	url_1 : result['posts'][0]['url'],
		    	author_1 : result['posts'][0]['author'],
		    	title_2 : result['posts'][1]['title'],
		    	url_2 : result['posts'][1]['url'],
		    	author_2 : result['posts'][1]['author'],
				username: req.user.username
			});
	  	}
 	});
});

router.get('/game', function(req, res, next) {
	res.render('game');
});

router.get('/stock',function(req,res,next){
	res.render('stock');
})
router.post('/', function(req, res, next){
	//console.log('search stock');
	//console.log(req.body.stockName);
	stockInfo.searchStockBySymbl(req.body.stockName, function(err, infom) {

		if (err) {
			//res.redirect('/error');
		}
		else {
			console.log(infom);
      res.redirect('/');
      
		}
	});
});

module.exports = router;
