// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var Assete = require('./asset');
var stock = require('../model/stock');
var stockInfo = require('../model/stockInfo');


// define the schema for our user model
var userSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  coin: {
    type: Number
  },
  notification_value: {
  	type: Number
  },
  watchlist: [ {type : mongoose.Schema.ObjectId, ref : 'stock' } ],
  alert: [{
  	sym: String,
  	msg: String
  }],
  resetPasswordToken: String,
	resetPasswordExpires: Date
});


// create the model for users and expose it to our app
var User = module.exports = mongoose.model('User', userSchema);


// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Create a new user
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
          newUser.password = hash;
          newUser.save(callback);
      });
  });
};

// Retrieve user by username
module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
};

// Retrieve user by email
module.exports.getUserByEmail = function(username, callback){
  var query = {email: email};
  User.findOne(query, callback);
};

// Retrieve user by id
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};

// Compare the password
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
  });
};

module.exports.checkCoin = function (userId,amount, callback){
	User.findOne({_id:userId}).exec(function(err,user){
		if(-1*amount > user.coin){
		callback(0);
		}
		else 
		callback(1);
	})

};

module.exports.updateCoin = function (userId,amount, callback){
	User.findOne({_id:userId}).exec(function(err,user){
		user.coin = user.coin + amount; 
		user.save(callback);
	})

};

module.exports.updateNotification = function(user, callback) {
	//console.log(user);
	var userlist = user.watchlist;
	//console.log(userlist);
	var listLength = userlist.length;

	for (var i = 0; i < listLength; i++) {
		stock.findOne({_id : userlist[i]}, function(err, stock){
			var sym = stock.symbol;
			
			stockInfo.searchStockBySymbl(sym, function(err, inform) {
				var s = JSON.parse(JSON.stringify(inform));
				var changePercent = s[sym]['quote']['changePercent'],
					companyName = s[sym]['quote']['companyName'],
					price = s[sym]['quote']['latestPrice'],
					pos_not_val = user.notification_value,
					neg_not_val = user.notification_value * -1,
					msg_list = user.alert;

				var isInArray = false,
					index = -1;

				for (var j = 0; j < msg_list.length; j++) {
					if (msg_list[j].sym === sym) {
						isInArray = true;
						if (isInArray) {
							index = j;
						}
						break;
					}
				}
				
				if (changePercent > pos_not_val){
					var msg = companyName + " have risen by " + changePercent + "%.", 
						new_alert_msg = new Object({
							sym: sym,
							msg: msg
						});
					if (isInArray) {
						user.alert.splice(index, 1);
					}
					user.alert.push(new_alert_msg);
					user.save();
				} else if (changePercent < neg_not_val) {
					var msg = companyName + " have dropped by " + changePercent + "%.",
						new_alert_msg = new Object({
							sym: sym,
							msg: msg
						});
					if (isInArray) {
						user.alert.splice(index, 1);
					}
					user.alert.push(new_alert_msg);
					user.save();
				}

			})
		});
	}
};

