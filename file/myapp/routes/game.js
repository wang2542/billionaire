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
	var bigList = {};
	req.user.watchlist.forEach(function(objectid, index) {
		//console.log(objectid, index);
		stock.findOne({_id: new ObjectId(objectid)}, function(err, res) {
			var sym = res.symbol;
		 	stockInfo.searchStockBySymbl(sym, function(err, data) {
		 		//console.log(data);
		 		var s = JSON.parse(JSON.stringify(data));


				var key = '' + index;
				bigList[key] = [];
		 		bigList[key].push(s[sym]['quote']['symbol']);
		 		bigList[key].push(s[sym]['quote']['companyName']);


		 		//console.log(memberList);
		 		//console.log(s[sym]['quote']['symbol']);
		 	});
		});
	});

	// var obj = bigList.map(function(res) {
	// 	return {
	// 		"symbol" : res[0],
	// 		"companyName" : res[1]
	// 	}
	// });

	// var jsonobj = JSON.stringify(obj);

	console.log(bigList);

	res.render('watchlist');
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

module.exports = router;
