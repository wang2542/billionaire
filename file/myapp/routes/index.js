var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var news = require('../model/news.js');
var localStorage = require('localStorage');
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
router.get('/about' , function(req,res,next){
	res.render('about');
});

router.get('/blank_page' , function(req,res,next){
	res.render('blank_page');
});
router.get('/new_signin' , function(req,res,next){
	res.render('new_signin');
});
router.get('/new_login' , function(req,res,next){
	res.render('new_login');
});
router.get('/home' , function(req,res,next){
    res.render('home');
});
router.get('/new_profile' , function(req,res,next){
    res.render('new_profile');
});
router.get('/game', function(req, res, next) {
	if (!req.user) {
  		req.flash('error_msg', 'Login Required!');
  		res.redirect('/');
	} else {
		res.render('game');
	}
});


router.post('/', function(req, res, next){
	console.log('search stock');
	console.log(req.body.stockName);
	stockInfo.searchStockBySymbl(req.body.stockName, function(err, infom) {

		if (err) {
			//res.redirect('/error');
		}
		else {
			var Stock = JSON.parse(JSON.stringify(infom));
		//	console.log(Stock[req.body.stockName]);
			localStorage.setItem('Stock',JSON.stringify(Stock[req.body.stockName]))
      		res.redirect('/stock');
      
		}
	});
});

router.get('/stock', function(req,res,next){
	console.log('get stock requrest accpeted');
	var stock = JSON.parse(localStorage.getItem('Stock'));
	console.log(stock.company.companyName);
	var decrease = false;
	if(stock.quote.change < 0)
		decrease = true;
	if(stock){
		res.render('stock',{
			company : stock.company,
			quote : stock.quote,
			chart : stock.chart,
			news : stock.news,
			decrease : decrease
		});
	}
	else 
		res.render('stock');
})

module.exports = router;
