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
router.get('/', function(req,res,next){
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
module.exports = router;
