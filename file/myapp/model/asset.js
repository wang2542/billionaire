var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var async = require('async');
var stockInfo = require('./stockInfo');
var user = require('./user');
var asseteSchema = mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    symbol: {
        type: String
    },
    quantity: {
        type: Number
    }
});

var Assete = module.exports = mongoose.model('assete', asseteSchema);

module.exports.modifyAssete = function(userId, symbol,quantity, type, callback){
    var query = {userId:userId, symbol:symbol};
    Assete.findOne(query).exec(function(err,assete){
        if(assete == null){
            console.log("Adding the new asset");
            var newAssete = new Assete({
                userId: userId,
                symbol: symbol,
                quantity: quantity
            });
            newAssete.save(callback);
        }
        else{
            console.log("updating the new asset");

            console.log(parseInt(quantity) * type * -1);
            assete.quantity = assete.quantity +  parseInt(quantity) * type * -1;
            console.log("assete Quantity" + assete.quantity);
            assete.save(callback);
        }
    });
}

module.exports.checkAssete = function(userId, symbol,quantity,callback){
    var query = {userId:userId, symbol:symbol};
    Assete.findOne(query).exec(function(err,assete){
        console.log(assete.quantity);
        console.log(quantity);
        console.log(assete.quantity >= quantity);
        if (assete.quantity >= quantity) {
            callback(err,1);
        }
        else {
            callback(err,0);
        }
    });
}
module.exports.getAssete = function(userId,callback){
    var query = {userId:userId};
    var total_assetes = new Array();
    var total_amount = 0;
    Assete.find(query).exec(function(err,result){
        console.log("Calcuating the user total asset");
        async.forEach(result, function(value,next){
            stockInfo.searchStockPriceBySymbl(value.symbol,function(err,price){
                var total_price = price * parseInt(value.quantity); 
                total_amount += total_price
                var temp = {
                    symbol: value.symbol,
                    quantity: value.quantity,
                    total_price: total_price,
                    price: price
                }
                
                total_assetes.push(temp);
                next();
            });
            
           
        },function(err){
            //console.log(total_amount);
            callback(err,total_assetes,total_amount);
        });
       
    });
}