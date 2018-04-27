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
    },
    total_cost: {
        type: Number
    }
});

var Assete = module.exports = mongoose.model('assete', asseteSchema);

module.exports.modifyAssete = function(userId, symbol,quantity, price,type, callback){
    var query = {userId:userId, symbol:symbol};
    Assete.findOne(query).exec(function(err,assete){
        if(assete == null){
            console.log("Adding the new asset");
            total_cost = price * parseInt(quantity);
            var newAssete = new Assete({
                userId: userId,
                symbol: symbol,
                quantity: quantity,
                total_cost: total_cost
            });
            console.log(price);
            console.log(parseInt(quantity));
            console.log(newAssete);
            newAssete.save(callback);
        }
        else{
            console.log("updating the new asset");

            total_cost = price* parseInt(quantity)* type *-1;
            console.log(total_cost);
            assete.quantity = assete.quantity +  parseInt(quantity) * type * -1;
            assete.total_cost = assete.total_cost + total_cost;
            console.log("assete total_cost" + assete.total_cost);
            
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
    var total_profit = 0;
    var total_value = 0;
    Assete.find(query).exec(function(err,result){
        console.log("Calcuating the user total asset");
        async.forEach(result, function(value,next){
            stockInfo.searchStockPriceBySymbl(value.symbol,function(err,price){
                var total_price = price * parseInt(value.quantity); 
                total_value += total_price;
                total_return = total_price - value.total_cost;
                avg_cost = value.total_cost / value.quantity;
                total_profit += total_return;
                console.log(value.total_cost);
                console.log(value.quantity);
                console.log(value.total_cost / value.quantity);
                var temp = {
                    symbol: value.symbol,
                    quantity: value.quantity,
                    total_price: total_price,
                    price: price,
                    avg_cost:Number(avg_cost).toFixed(2) ,
                    total_return: Number(total_return).toFixed(2),
                };
                
                total_assetes.push(temp);
                next();
            });
            
           
        },function(err){
            callback(err,total_assetes,total_profit,total_value);
        });
       
    });
}