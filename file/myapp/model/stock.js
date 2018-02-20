var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');
var path = require('path');
var data;
var schema = mongoose.Schema;

var stockSchema = schema({
    name: {
        type:String,
        index: true
    },
    symbol: {
        type:String
    },
    isEnabled: {
        type: Boolean
    } 
});

var stock = module.exports= mongoose.model('stock',stockSchema);

module.exports.createStock = function(newStock, callback){
    newStock.save(callback);
}

module.exports.getStockSymbleByName = function (name, callback){
    var query = {name:name};
    stock.findOne(query, callback);
}

module.exports.init = function (callback){
    var obj;
fs.readFile('/Users/sfu/github/billionaire/file/myapp/stock/stockSymbol.json', 'utf8', function(err, data){
    if (err) console.log(err);
    console.log(data);
    obj = JSON.parse(data);
});
console.log(obj);
async.eachSeries(obj, function(keys,callback){
    var newStock = new stock({
        symbol: keys.symbol,
        isEnabled: keys.isEnabled
    });
    stock.createStock(newStock,callback);
});


}