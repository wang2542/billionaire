var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var stockInfo = require('../model/stockInfo');
var Transaction = require('../model/transaction');
var User = require('../model/user');
var Asset = require('../model/asset');
var async = require('async');


router.get('/', function(req, res, callback) {
    res.render('trade', {
        sym : req.query.sym,
        price :  req.query.price
    }); 
});

router.post('/', function (req, res, callback) {
	console.log("transaction");
	var price = parseFloat(req.body.price).toFixed(2),
		quantity = parseInt(req.body.quantity),
		typeStr = req.body.transaction,
		user_id = req.user._id,
		sym = req.body.sym,
		typeT;
	// price.toFixed(2);
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
                        res.json({ error: "sorry you do not have enough coin to buy" });
                        return;
                    }
                    
                })
            } else {
            	Asset.checkAssete(user_id, sym, quantity,(err,response)=>{
	                if (response == 0){
	                	console.log("error not enough stock");
	                    res.json({ error: "sorry you do not have enough stock to sell" });
	                    return;
	                }
	            });
            }
            next();
        },
        function(next) {
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
                //user_id = 1;
                console.log(price);
                Asset.modifyAssete(user_id, sym, quantity,price, typeT, function (err) {
                	console.log("modifyasset");
                	console.log(user_id);
                	console.log(sym);
                	console.log(quantity);
                	console.log(typeT);
                   	User.updateCoin(user_id,total,typeT, next);
                   	console.log("updateCoin");
                });
                
            });
        }
    ], function(err, results) {
        res.redirect('/game');
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