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

    time: {
        type:String
    },
});

var notification = module.exports= mongoose.model('notification',notificationSchema);

module.exports.createNotification = function(newNotification, callback){
    newNotification.save(callback);
}

module.exports.getNotificationByUserId = function(userId, callback) {
    var query = {userId:userId};
    stock.findAll(query, callback);
}

