var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var stockInfo = require('../model/stockInfo');
var transaction = require('../model/transaction');
var User = require('../model/user');

router.post('/', function(req,res,next){
    console.log(req.query.stockName);
    stockInfo.searchStockBySymbl(req.query.stockName, function(err, infom) {
		var stock = JSON.parse(JSON.stringify(infom));
        var total = stock[req.query.stockName].quote.latestPrice * req.query.quantity;
	});
    var trasnactionData = {
   //     date : new date(),
        userId: req.query.user_id,
        symbol: req.query.stockName,
        type: req.query.type,
        quantity: req.query.quantity,
        total: total,

    }
});

module.exports = router;