var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//var localStorage = require('localStorage');

var stockInfo = require('../model/stockInfo');
var User = require('../model/user');


/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.user) {
		res.render('index-6');
	} else {
		res.render('index-6', {
			username: req.user.username,
		});
	}
  
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
