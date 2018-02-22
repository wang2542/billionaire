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
    type: {
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
    var p = path.normalize(path.join(__dirname, '/..','stockSymbol.json'));
    console.log(p);
fs.readFile(p, 'utf8', function(err, data){
    if (err) console.log(err);
   // console.log(data);
    obj = JSON.parse(data);
    async.eachSeries(obj, function(keys,callback){
      //  console.log("inserting new stock");
        var newStock = new stock({
            name: keys.name,
            symbol: keys.symbol,
            isEnabled: keys.isEnabled,
            type: keys.type
            
        });
        stock.createStock(newStock,callback);
    });
});
//console.log(obj);

module.exports.searchStockByName = function (name, callback){
    stock.find({name:name}, function(err, result){
        console.log(result);
    });
}


}