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


    var total = req.query.price * req.query.quantity;
    async.parallel([
        function(next) {
            //If user want to buy stock
            if (req.query.typeT == -1) {
                user_id = 1;
                User.checkCoin(user_id, total, (response)=>{
                    if(response == 0){
                        res.json({ error: "sorry you do not have enough coin to buy" });
                        return;
                    }
                    next();
                })
            }
        },
        function(next) { 
             //If user want to sell stock
            if (req.query.typeT == 1) {
            user_id = 1;
            Asset.checkAssete(user_id, req.query.stockName,req.query.quantity,(err,response)=>{
                if (response == 0){
                    res.json({ error: "sorry you do not have enough stock to sell" });
                    return;
                }
                total = -1 * total;
                next();
                
            });
            }
            else next();
        },
        function(next) {
            var transaction = new Transaction({
                date: new Date(),
                userId: req.query.user_id,
                symbol: req.query.stockName,
                type: req.query.typeT,
                quantity: req.query.quantity,
                total: total,
            });
            Transaction.createTransaction(transaction, function (err) {
                user_id = 1;
                var quantity = parseInt(req.query.quantity) *-1* parseInt(req.query.typeT);
                Asset.addAssete(user_id, req.query.stockName, quantity, function (err) {
                   User.updateCoin(user_id,total,next);
                });
                
            });
        }
    ], function(err, results) {
        res.json("Sucesses");
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