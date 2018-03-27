var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var localStorage = require('localStorage');

var news = require('../model/news.js');
var stock = require('../model/stock');
var stockInfo = require('../model/stockInfo');
var User = require('../model/user');

var ObjectId = require('mongodb').ObjectID;



router.get('/watchlist', function(req, res, next) {
	console.log(req.user.watchlist.length);
	if (req.user.watchlist.length == 0) {
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
			 			res.render('watchlist', {
			 				bigList:bigList
			 			});
			 		}
			 	});
			});
		});
	}
});



router.post('/watchlist', function(req, res, next) {
	//Add stock to watchlist
	//How to test to see if this is working
	//0. Log in before you test this
	//1. Type stock symbol on the search box at the bottom (Needs to be All upper case)
	//2. Open Robomongo (or other GUI) to check if watchlist was appended

	stock.findOne({ symbol : req.body.stockSym}, function(err, stock) {
		if (!stock) {
			req.flash('error', 'stock not found');
			console.log('stock not found');
			return res.redirect('/game/watchlist');
		}

		var isInArray = req.user.watchlist.some(function(stockid) {
			return stockid.equals(stock._id);
		});

		// console.log(isInArray);

		if (isInArray) { 
			req.flash('error', 'stock already exists in watchlist');
			console.log('stock already exists in watchlist');
			return res.redirect('/game/watchlist');
		} else {
			req.user.watchlist.push(stock._id);
			req.user.save();
		}

		console.log('watchlist added');
		req.flash('success', 'watchlist added');
		return res.redirect('/game/watchlist');
	});

	//stock.findOneAndUpdate({symbol : })


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

module.exports = router;
