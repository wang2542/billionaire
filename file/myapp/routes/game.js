var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var localStorage = require('localStorage');

var news = require('../model/news.js');
var stock = require('../model/stock');
var stockInfo = require('../model/stockInfo');
var User = require('../model/user');

var ObjectId = require('mongodb').ObjectID;


router.get('/', function(req,res,next) {


	if (!req.user) {
		req.flash('error_msg', 'Login Required!');
		res.redirect('/user/login');
	} else {
		console.log(req.user.alert.length);
		res.render('game',{
			user: req.user,
			num: req.user.alert.length
		});
	}
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

router.post('/watchlist/checkNotify', function(req, res, next) {
	var userlist = req.user.watchlist;
	var listLength = userlist.length;

	for (var i = 0; i < listLength; i++) {
		stock.findOne({_id : userlist[i]}, function(err, stock){
			var sym = stock.symbol;
			
			stockInfo.searchStockBySymbl(sym, function(err, inform) {
				var s = JSON.parse(JSON.stringify(inform));
				var changePercent = s[sym]['quote']['changePercent'],
					companyName = s[sym]['quote']['companyName'],
					price = s[sym]['quote']['latestPrice'],
					pos_not_val = req.user.notification_value,
					neg_not_val = req.user.notification_value * -1,
					msg_list = req.user.alert;

				var isInArray = false,
					index = -1;

				for (var j = 0; j < msg_list.length; j++) {
					if (msg_list[j].sym === sym) {
						isInArray = true;
						if (isInArray) {
							index = j;
						}
						break;
					}
				}
				
				if (changePercent > pos_not_val){
					var msg = companyName + " have risen by " + changePercent + "%.", 
						new_alert_msg = new Object({
							sym: sym,
							msg: msg
						});
					if (isInArray) {
						req.user.alert.splice(index, 1);
					}
					req.user.alert.push(new_alert_msg);
					req.user.save();
				} else if (changePercent < neg_not_val) {
					var msg = companyName + " have dropped by " + changePercent + "%.",
						new_alert_msg = new Object({
							sym: sym,
							msg: msg
						});
					if (isInArray) {
						req.user.alert.splice(index, 1);
					}
					req.user.alert.push(new_alert_msg);
					req.user.save();
				}

			})
		});
	}

	//console.log(req.user);


	res.redirect('/game/watchlist');

});
module.exports = router;
