var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');
var data;
var schema = mongoose.Schema;

var stockSchema = mongoose.schema({
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

module.exports.init = function (file, callback){
fs.readFile('../stock/stockSymbol.json', 'utf8', function(err, data){
    if (err) throw err;
    obj = JSON.parse(data);
});
async.eachSeries(obj, function(keys,callback){
    var newStock = new stock({
        symbol: keys.symbol,
        isEnabled: keys.isEnabled
    });
    stock.createStock(newStock,callback);
});


}