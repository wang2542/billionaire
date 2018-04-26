// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var Assete = require('./asset');
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
  watchlist: [ {type : mongoose.Schema.ObjectId, ref : 'stock' } ],
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

module.exports.updateCoin = function (userId, callback){
    Assete.getAssete(userId,function(err, total_assetes, total_price){
        User.update({_id:userId},{$set:{
          coin: parseInt(total_price)
        }},callback);
    });

};