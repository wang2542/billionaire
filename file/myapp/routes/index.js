var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var news = require('../model/news.js');
var localStorage = require('localStorage');
var stock = require('../model/stock');
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


router.post('/', function(req, res, next){
	console.log('search stock');
	console.log(req.body.stockName);
	stockInfo.searchStockBySymbl(req.body.stockName, function(err, infom) {

		if (err) {
			//res.redirect('/error');
		}
		else {
			
			if (JSON.stringify(infom) === '{}') {
				req.flash('error_msg', 'Can not find this Stock!');
				res.redirect('/');
			}
			else{
				var Stock = JSON.parse(JSON.stringify(infom));
			
				localStorage.setItem('Stock',JSON.stringify(Stock[req.body.stockName]))
			  	res.redirect('/stock');
			}
      
		}
	});
});

router.get('/stock', function(req,res,next){
	console.log('get stock requrest accpeted');
	var stock = JSON.parse(localStorage.getItem('Stock'));
	var decrease = false;
	var user = null;
	if (req.user) user = req.user;
	console.log(stock == null)
	if(stock ){
		
		if(stock.quote.change < 0)
			decrease = true;
		res.render('stock',{
			company : stock.company,
			quote : stock.quote,
			chart : stock.chart,
			news : stock.news,
			decrease : decrease,
			user: user
		});
	}
	else {
		req.flash('error_msg', 'Can not find this Stock!');
		res.redirect('/');
	}
		
});

router.post('/stock/add', function(req, res, next) {
	var stock_sym = req.body.symbol;
    if (!req.user) {
		req.flash('error_msg', 'Login Required!');
		res.redirect('/user/login');
	}

	else {stock.findOne({ symbol : stock_sym}, function(err, stock) {
		var isInArray = req.user.watchlist.some(function(stockid) {
			return stockid.equals(stock._id);
		});

		// console.log(isInArray);

		if (isInArray) { 
			req.flash('error', 'stock already exists in watchlist');
			console.log('stock already exists in watchlist');
			return res.redirect('/stock');
		} else {
			req.user.watchlist.push(stock._id);
			req.user.save();
			req.flash('success', 'watchlist added');
			console.log('watchlist added');
			return res.redirect('/stock');
		}

		
		
	});
   }
});

module.exports = router;
