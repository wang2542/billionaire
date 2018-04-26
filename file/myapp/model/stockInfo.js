var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var newsInfom ={
    url: 'https://api.iextrading.com/1.0/stock/market/batch',
    method: 'GET',
    qs: {
        symbols: '',
        types: 'company,quote,news,chart',
        range: '1m',
        last: '5'
    }
}


exports.searchStockBySymbl = function(symbl, callback) {
    newsInfom.qs.symbols = symbl;
    request(newsInfom, function(error,response,body) {
        
        if(error) return callback(error);
        else {
            var json = JSON.parse(body);
            //console.log(json);
            if( json) {
               
                callback(error,json);
            }
            else  
            callback(error,null);
        }
    });

}

exports.searchStockPriceBySymbl = function(symbl, callback) {
    this.searchStockBySymbl(symbl, function(err, infom) {
        var stock = JSON.parse(JSON.stringify(infom));
    
        var price = stock[symbl].quote.latestPrice;
        callback(err,price);
    });
}

exports.searchPriceByFamousSymbol = function(callback) {
    newsInfom.qs.symbols = 'AAPL, AMZN, GOOG, NFLX, ADBE, GS, JPM, C, MS, BX, IBM';
    request(newsInfom, function(error, response, body) {
        if (error) return callback(error);
        else {
            var json = JSON.parse(body);
            if(json) {
                callback(json);
            }else {
                callback(error,null);
            }
        }
    });
}