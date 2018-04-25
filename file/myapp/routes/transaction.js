var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var stockInfo = require('../model/stockInfo');
var Transaction = require('../model/transaction');
var User = require('../model/user');

router.post('/', function(req,res,next){
    console.log(req.query.stockName);
    
    stockInfo.searchStockPriceBySymbl(req.query.stockName, function(err, price) {
	
        var total = price * req.query.quantity;
        var transaction =  new Transaction({
                 date : new Date(),
                 userId: req.query.user_id,
                 symbol: req.query.stockName,
                 type: req.query.typeT,
                 quantity: req.query.quantity,
                 total: total,
             });
        
        Transaction.createTransaction(transaction, function(err){
            // call user.update asset 
            console.log(err);
            res.redirect('/');
        })
	});
  
});

router.get('/history', function(req,res,next){
    var user_id = 1;
    Transaction.getTransactionByUserId(user_id, (err,result)=> {
        res.json(result);
    });
    
})

router.get('/history/recent', function(req,res,next){
    var user_id = 1;
    Transaction.getRecentTransactionByUserId(user_id, (err,result)=> {
        res.json(result);
    });
    
})

router.get('/popular', function(req,res,next){
    var user_id = 1;
    Transaction.getPopularStock((err,result)=> {
        res.json(result);
    });
    
})


module.exports = router;