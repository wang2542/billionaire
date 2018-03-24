var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var news = require('../model/news.js');
//var localStorage = require('localStorage');

var stockInfo = require('../model/stockInfo');
var User = require('../model/user');


router.get('/watchlist', function(req, res, next) {
	res.render('watchlist');
});

module.exports = router;
