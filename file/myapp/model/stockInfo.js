var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var newInfom ={
    url: 'https://api.iextrading.com/1.0/stock/market/batch',
    method: 'GET',
    qs: {
        symbols: '',
        types: 'quote,news,char',
        range: '1m',
        last: '5'
    }
}


exports.searchStockBySymbl = function(symbl, callback) {
    newInfom.qs.symbols = symbl;
    request(newInfom, function(error,response,body) {
        if(error) return callback(error);
        else {
            var json = JSON.parse(body);
            console.log(json.result);
            if( json.result) {
                //console.log(json.result.formatted_address);
                callback(null,json);
            }
            else  
            callback(error,null);
        }
    });

}