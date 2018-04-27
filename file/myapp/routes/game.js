var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var localStorage = require('localStorage');

var news = require('../model/news.js');
var stock = require('../model/stock');
var stockInfo = require('../model/stockInfo');
var User = require('../model/user');
var Transaction = require('../model/transaction');
var Asset = require('../model/asset')
var ObjectId = require('mongodb').ObjectID;
var async = require('async');


router.get('/', function(req,res,next) {
	var assete;
	var transactionHistory;
	if (!req.user) {
		req.flash('error_msg', 'Login Required!');
		res.redirect('/user/login');
	} else {
		// console.log(req.user.alert.length);
		async.parallel([
			function(next){
				
				Asset.getAssete(req.user._id,(err,total_assetes,total_profit,total_value)=> {
					var percent_increase = Number(((total_value+req.user.coin)/10000) -1 ).toFixed(2);  ;
					var result = {
						total_profit: Number(total_profit).toFixed(2),
						total_assetes: total_assetes,
						percent_increase:percent_increase
					}
					assete = result;
					next();
				});
			},
			function(next){
				Transaction.getRecentTransactionByUserId(req.user._id, (err, result) => {
					transactionHistory = result;
					next();
				});
			}
		],function(err,results){
			stockInfo.searchPriceByFamousSymbol(function(callback) {
				res.render('game', {
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
				   user : req.user,
				   assete:assete,
				   transactionHistory: transactionHistory
				});	
			 });
		});
		
	}
});

router.get('/knowledge' , function(req,res,next){
    stockInfo.searchPriceByFamousSymbol(function(callback) {
		res.render('knowledge', {
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
		    user : req.user
		});	
	});
});
router.get('/tutorial' , function(req,res,next){
    stockInfo.searchPriceByFamousSymbol(function(callback) {
		res.render('tutorial', {
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
		    user : req.user
		});	
	});
});

router.get('/strategies' , function(req,res,next){
    stockInfo.searchPriceByFamousSymbol(function(callback) {
		res.render('strategies', {
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
		    user : req.user
		});	
	});
});

router.get('/trade_hist' , function(req,res,next){
	if (!req.user) {
		req.flash('error_msg', 'Login Required!');
		res.redirect('/user/login');
	} else {
		Transaction.getTransactionByUserId(req.user._id, (err, result) => {
			transactionHistory = result;
			console.log(result);
			stockInfo.searchPriceByFamousSymbol(function(callback) {
				res.render('trade_hist', {
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
					user : req.user,
					transactions : result
				});
			});
		});
	}
    
});



router.post('/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/game');
});

router.post('/tutorial/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/game/trade_hist');
});

router.post('/trade_hist/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/game/trade_hist');
});

router.post('/knowledge/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/game/knowledge');
});

router.post('/strategies/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/game/strategies');
});

router.get('/watchlist', function(req, res, next) {
	//console.log(req);
	if (!req.user) {
		req.flash('error_msg', 'Login Required!');
		res.redirect('/user/login');
	}

	else if (req.user.watchlist.length == 0) {
		res.render('watchlist');
	} else {
		var bigList = {},
			userlist = req.user.watchlist;

		userlist.forEach(function(objectid, index) {
			//console.log(objectid, index);
			stock.findOne({_id: new ObjectId(objectid)}, function(err, stocksym) {
				var sym = stocksym.symbol;
			 	stockInfo.searchStockBySymbl(sym, function(err, data) {
			 		var objsize = Object.keys(bigList).length;

			 		var s = JSON.parse(JSON.stringify(data));

					var key = '' + index;
					bigList[key] = {
						object_id : objectid,
						symbol : s[sym]['quote']['symbol'],
						companyName : s[sym]['quote']['companyName'],
						latestPrice : s[sym]['quote']['latestPrice'],
						change : s[sym]['quote']['change'],
						changePercent : s[sym]['quote']['changePercent'],
			 			latestVolume : s[sym]['quote']['latestVolume'],
			 			avgTotalVolume : s[sym]['quote']['avgTotalVolume'],
			 			latestSource : s[sym]['quote']['latestSource']
					};	
			 		if (objsize == userlist.length - 1) {
			 			//console.log(bigList);
			 			stockInfo.searchPriceByFamousSymbol(function(callback) {
							res.render('watchlist', {
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
							    user : req.user,
							    bigList : bigList
							 });	
						});
			 			// res.render('watchlist', {
			 			// 	user: req.user,
			 			// 	bigList:bigList
			 			// });
			 		}
			 	});
			});
		});
	}
});


router.get('/hisotry' , function(req,res,next){
    res.render('trade_history');
});


router.post('/watchlist', function(req, res, next) {

});

router.post('/watchlist/remove', function(req, res, next) {
	var object_id = req.body.object_id;
	//console.log(object_id);

	var userlist = req.user.watchlist;
	var index = userlist.indexOf(object_id);

	//console.log(index);

	if (index == -1) {
		req.flash('error', 'Watchlist could not be removed due to server traffic. Please Try Again.');
	} else {
		req.user.watchlist.splice(index, 1);
		req.user.save();
		req.flash('success', 'Remove successful.');
	}

	res.redirect('/game/watchlist');

});
router.post('/watchlist/navigate', function(req, res, next) {
	var symbol = req.body.symbol;
	//console.log(req.body.symbol);

	//console.log(req.body.stockName);
	stockInfo.searchStockBySymbl(symbol, function(err, infom) {

		if (err) {
			//res.redirect('/error');
		}
		else {
			var Stock = JSON.parse(JSON.stringify(infom));
		//	console.log(Stock[req.body.stockName]);
			localStorage.setItem('Stock',JSON.stringify(Stock[symbol]))
      		res.redirect('/stock');
      
		}
	});
	//res.redirect('/game/watchlist');
});

router.post('/watchlist/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/game/watchlist');
});

module.exports = router;
