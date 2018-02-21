var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//var localStorage = require('localStorage');

var stockInfo = require('../model/stockInfo');
var User = require('../model/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index-6', { title: 'Express' });
});

router.post('/', function(req, res, next){
	console.log('search course');
	//console.log(req.body.coursename);
	stockInfo.searchStockBySymbl(req.body.stockName, function(err, infom) {
		if (err) {
			//res.redirect('/error');
		}
		else {
		//	localStorage.setItem('Course',JSON.stringify(course));
			res.redirect('/stock');
		}
	});
});


module.exports = router;
