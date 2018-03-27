var mongoose = require('mongoose');
var schema = mongoose.Schema;

var notificationSchema = schema({
    userId: {
        type:String,
        index: true
    },
    message: {
        type:String
    },

    date: {
        type:Date
    },

    status: {
        type: int
    }
});

var notification = module.exports= mongoose.model('notification',notificationSchema);

module.exports.createNotification = function(newNotification, callback){
    newNotification.save(callback);
}

module.exports.getNotificationByUserId = function(userId, callback) {
    var query = {userId:userId};
    stock.findAll(query, callback);
}

module.exports.dailyNotificationByUserId = function(userId,date, callback) {
    var query = {userId:userId, date:date};
    stock.findOne(query,function(err,message){
        if(!message) {
            
        }
    });
}
