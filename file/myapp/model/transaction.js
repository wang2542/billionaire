var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');
var path = require('path');
var map = require('sorted-map')
var schema = mongoose.Schema;
var stockInfo = require('../model/stockInfo');

var transactionSchema = schema({
    userId: {
        type:String,
        index: true
    },
    symbol: {
        type:String
    },
    type: {
        type:Number
    },
    quantity: {
        type: Number
    },
    total: {
        type: Number
    },
    date: {
        type:Date
    }
});

var transaction = module.exports = mongoose.model('transaction',transactionSchema);

module.exports.createTransaction = function(newTransaction, callback){
    console.log(newTransaction);
    newTransaction.save(callback);
}

module.exports.getTransactionByUserId =  function(userId, callback) {
    var query = {userId:userId};

    transaction.find(query).sort({date:-1}).exec(callback);
}

module.exports.getRecentTransactionByUserId = function (userId, callback) {
    var cutoff = new Date();
    var begin = cutoff.getDate() - 7;
    transaction.find({
        userId:userId,
        $or: [
            {date: {$gte:begin}},
            {date: {$lte:cutoff}}
        ]
    }).exec(callback);
}

module.exports.getPopularStock = function(callback) {
    var cutoff = new Date();
    var begin = cutoff.getDate() - 7;
    transaction.find({
        $or: [
            {date: {$gte:begin}},
            {date: {$lte:cutoff}}
        ]
    }).exec(function(err,result){
        var stockCount = new map();
        var transactions = JSON.parse(JSON.stringify(result));
        var topReuslt = new Array();
       // console.log(transactions)
        async.series([
            function(next){
                for(var temp in transactions){
                    
                    //console.log(transactions[temp].symbol);
                    var symbol = transactions[temp].symbol;
                    if(stockCount.has(symbol))
                        stockCount.set(symbol,stockCount.get(symbol)+1);
                    else
                        stockCount.set(symbol,1);
                    
                }
                next();
            },
            function(next){
                //console.log(stockCount);

                async.forEachOf(stockCount._map,function(value,key,next){
                    if(stockCount.rank(key) >= stockCount.length -10){
                        stockInfo.searchStockPriceBySymbl(key, function(err, price) { 
                            var data = {
                                symbol: key,
                                price: price
                            }
                            topReuslt.push(data);
                            next();
                        });
                        
                    } 
                    else   next();
                },function(err){
                    next()
                });
               
            }
        ],function(err){
            callback(err,topReuslt)

        })
    });
}
