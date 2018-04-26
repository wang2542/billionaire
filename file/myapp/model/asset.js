var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var async = require('async');
var stockInfo = require('./stockInfo');
var user = require('../model/user');
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

module.exports.addAssete = function(userId, symbol,quantity,callback){
    var query = {userId:userId, symbol:symbol};
    Assete.findOne(query).exec(function(err,assete){
        if(assete == null){
            console.log("Adding the new asset");
            var newAssete = new Assete({
                userId: userId,
                symbol: symbol,
                quantity: quantity
            });
            newAssete.save(function(){
               //  callback();
                 user.updateCoin(userId, callback);
            });
        }
        else{
            console.log("updating the new asset");
            assete.quantity = parseInt(assete.quantity) + parseInt(quantity);
            assete.save(function() {
               // callback();
                user.updateCoin(userId, callback);
            });
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
                    total_price: total_price
                }
                
                total_assetes.push(temp);
                next();
            });
            
           
        },function(err){
            console.log(total_amount);
            callback(err,total_assetes,total_amount);
        });
       
    });
}