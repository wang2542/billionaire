var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');
var path = require('path');
var map = require('sorted-map')
var schema = mongoose.Schema;

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
        teyp:Date
    }
});

var transaction = module.exports = mongoose.model('transaction',transactionSchema);

module.exports.createTransaction = function(newTransaction, callback){
    newTransaction.save(callback);
}

module.exports.getTransactionByUserId =  function(userId, callback) {
    var query = {userId:userId};

    transaction.find(query).sort({date:-1}).execFind(function(err,result){
        callback (err,result);
    });
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
    }).execFind(function(err,result){
        callback(err,result);
    });
}

module.exports.getPopularStock = function(callback) {
    var cutoff = new Date();
    var begin = cutoff.getDate() - 7;
    transaction.find({
        $or: [
            {date: {$gte:begin}},
            {date: {$lte:cutoff}}
        ]
    }).execFind(function(err,result){
        var stockCount = new map();
        var transactions = JSON.parse(JSON.stringify(result));
        var topReuslt = new Array();
        async.series([
            function(next){
                for(var symbol in transaction){
                    if(stockCount.has(symbol))
                        stockCount.set(symbol,stockCount.get(symbol)+1);
                    else
                        stockCount.set(symbol,1);
                }
                next();
            },
            function(next){
                for(var key in stockCount){
                    if(stockCOunt.rank(key) <= 10)
                        topReuslt.push(key);
                }
                next();
            }
        ],function(err){
            callback(err,topReuslt)

        })
    });
}
