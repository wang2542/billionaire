var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var stockInfo = require('../model/stockInfo');
var Transaction = require('../model/transaction');
var User = require('../model/user');
var Asset = require('../model/asset');
var async = require('async');


router.get('/', function(req, res, callback) {
    stockInfo.searchPriceByFamousSymbol(function(callback) {
        res.render('trade', {
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
            sym : req.query.sym,
            price :  req.query.price
        }); 
    });
});

router.post('/', function (req, res, callback) {
	var price = parseFloat(req.body.price).toFixed(2),
		typeStr = req.body.transaction,
		user_id = req.user._id,
		sym = req.body.sym,
		typeT;

	var	quantity = Number(req.body.quantity);
    var total = price*quantity;

    if (typeStr === "Buy") {
    	typeT = -1;
    } else {
    	typeT = 1;
    }

    async.parallel([
        function(next) {
            //If user want to buy stock
            if (typeT == -1) {
                User.checkCoin(user_id, total, (response)=>{
                    if(response == 0){
                    	console.log("error not enough money");
						next(true);
                    	return;
                    } else {
                    	next(-1);
                    }
                });

            } else {
            	Asset.checkAssete(user_id, sym, quantity,(err,response)=>{
	                if (response == 0){
	                	console.log("error not enough stock");
	                    next(true);
                    	return;
	                } else {
	                	next(-1);
	                }
	            });
            }
        }
    ], function(err, results) {
    	console.log(err);
    	if (err && err != -1) {
    		console.log("errorroror");
    		var error_msg = 'Transaction Failed. Check your assets or coins.';
            stockInfo.searchPriceByFamousSymbol(function(callback) {
                res.render('trade', {
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
                    sym : sym,
                    price : price,
                    error_msg : error_msg
                }); 
            });
    	} else if (isNaN(quantity)){
    		console.log("nanananan");
			var error_msg = 'Transaction Failed. Quantity must be an integer.';
            stockInfo.searchPriceByFamousSymbol(function(callback) {
                res.render('trade', {
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
                    sym : sym,
                    price :  price,
                    error_msg : error_msg
                }); 
            });

    	} else {
    		console.log("success");
        	//console.log("transaction");
            var transaction = new Transaction({
                date: new Date(),
                userId: user_id,
                symbol: sym,
                quantity: quantity,
                price:price,
                total: total,
                type: typeStr
            });
            console.log(transaction);

            Transaction.createTransaction(transaction, function (err) {
                Asset.modifyAssete(user_id, sym, quantity,price, typeT, function (err) {
                   	User.updateCoin(user_id,total,typeT, function(err) {
	                   	req.flash('success_msg', 'Transaction Successful!');
	                   	res.redirect('/game');
                   	});
                });
                
            });
        }
    });

});



router.get('/history', function (req, res, next) {
    var user_id = 1;
    Transaction.getTransactionByUserId(user_id, (err, result) => {
        result = JSON.parse(JSON.stringify(result));
        res.render('trade_history', { history: result });

    });

})

router.get('/history/recent', function (req, res, next) {
    var user_id = 1;
    Transaction.getRecentTransactionByUserId(user_id, (err, result) => {
        console.log(result);
        res.json(JSON.parse(JSON.stringify(result)));
    });

})

router.get('/popular', function (req, res, next) {

    Transaction.getPopularStock((err, result) => {
        res.json(result);
    });

})


module.exports = router;