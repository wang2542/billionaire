var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var localStorage = require('localStorage');
var stock = require('../model/stock');
var stockInfo = require('../model/stockInfo');
var User = require('../model/user');
var async = require('async');

router.post('/', function(req, res, next){
	console.log('search stock');
	console.log(req.body.stockName=="");
	if(req.body.stockName==""){
		req.flash('error_msg', 'Stock Name cannot be empty');
		res.redirect('/');
	}
	else{
	stockInfo.searchStockBySymbl(req.body.stockName, function(err, infom) {
		var Stock = JSON.parse(JSON.stringify(infom));
		if (err) {
			req.flash('error_msg', JSON.stringify(err));
			res.redirect('/');
		}
		else {
			
			if (JSON.stringify(infom) === '{}') {
				req.flash('error_msg', 'Can not find this Stock!');
				res.redirect('/');
			}
			else{
				
				
				localStorage.setItem('Stock',JSON.stringify(Stock[req.body.stockName]))
			  	res.redirect('/stock');
			}
      
		}
	});
	}
});
router.get('/', function(req,res,next){
	console.log('get stock requrest accpeted');
	var stock = JSON.parse(localStorage.getItem('Stock'));
	var decrease = false;
	var user = null;
	if (req.user) user = req.user;
	
	console.log(stock == null)
	if(stock && stock.company ){
		
		if(stock.quote.change < 0)
			decrease = true;

		stockInfo.searchPriceByFamousSymbol(function(callback) {
			 res.render('stock', {
			    aapl : callback['AAPL']['quote']['latestPrice'],
			    amzn : callback['AMZN']['quote']['latestPrice'],
			    goog : callback['GOOG']['quote']['latestPrice'],
			    nflx : callback['NFLX']['quote']['latestPrice'],
			    adbe : callback['ADBE']['quote']['latestPrice'],
			    gs : callback['GS']['quote']['latestPrice'],
			    jpm : callback['JPM']['quote']['latestPrice'],
			    c : callback['C']['quote']['latestPrice'],
			    ms : callback['MS']['quote']['latestPrice'],
			    bx : callback['BX']['quote']['latestPrice'],
			    ibm : callback['IBM']['quote']['latestPrice'],
			    company : stock.company,
				quote : stock.quote,
				chart : stock.chart,
				news : stock.news,
				decrease : decrease,
				user: user
			 });	
	  	});
	}
	else {
		req.flash('error_msg', 'Can not find this Stock!');
		res.redirect('/');
	}
		
});

router.post('/add', function(req, res, next) {
    console.log("adding the stock to watchlist")
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

const url = require('url');

router.post('/trade', function(req, res, next) {
    console.log("moving to transaction page")
	var stock_sym = req.body.symbol,
		stock_price = req.body.price;
    if (!req.user) {
		req.flash('error_msg', 'Login Required!');
		res.redirect('/user/login');
	}

	else {
		console.log(stock_sym);
		console.log(stock_price);

		/*res.render('trade', {
			sym : stock_sym,
			price : stock_price
		});*/
		res.redirect(url.format({
			pathname:"/transaction",
			query: {
				"sym" : stock_sym,
				"price" : stock_price
			}
		}));
   }

  
});


router.get('/chart', function(req,res,next){
	console.log('geting stock chart');
	var chart = JSON.parse(localStorage.getItem('Stock')).chart;
	var data = [];
	async.eachSeries(chart, function(obj, next){
	
		var temp = {
			date : obj.date,
			price: obj.open,
			volumne:  obj.volume
		};
		data.push(temp);
		next();
		 }, function(err){
			 if(err) return callback(err);
			 res.json(data);
		 });
	
});

router.post('/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/stock');
});

module.exports = router;
