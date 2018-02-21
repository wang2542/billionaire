var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var async = require('async');
var User = require('../model/user');

//Deploy local strategy of passport
passport.use(new LocalStrategy( function(username, password, done) {
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Unknown User'});
		}

		User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Invalid password'});
				}
			});
		});
}));


/* GET users listing. */
router.get('/signup', function(req, res, next) {
	//res.send('respond with a resource');
	res.render('signup');
});

router.get('/login', function(req, res, next) {
  //res.send('respond with a resource');
	res.render('login');
});

router.get('/profile', function(req, res, next) {
  //res.send('respond with a resource');
	res.render('profile', {
		username : req.user.username,
		password : req.user.password,
		email: req.user.email,
		coin : req.user.coin
	});
});

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success_msg', 'Logged Out');
	res.redirect('/');
})

router.post('/signup', function(req, res, next) {
	var signupUsername = req.body.username;
	var signupEmail = req.body.email;
	var signupPassword = req.body.password;
	var signupConfirmPassword = req.body.passwordConfirm;

	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
	req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);
	var errors = req.validationErrors();

	if(errors){
		return res.render('signup',{
			errors:errors
		});
	} else {
		var newUser = new User({
			email: signupEmail,
			username: signupUsername,
			password: signupPassword,
			coin: 5
		});

		User.find({$or: [{username: signupUsername}, {email: signupEmail}]}, function(err, docs) {
			if (docs.length) {
				req.flash('error_msg', 'The username or email has already existed');
				return res.redirect('/user/signup');
			}
			else {
				User.createUser(newUser, function(err, user){
				if(err) throw err;
				//console.log(user);
					return res.redirect('/user/login');
				});
				req.flash('success_msg', 'You are registered and can now login.');
			}
		});
			
		}

});

router.post('/login', function(req, res, next) {
	// Check if the username and password match
	passport.authenticate('local', function(err, user, info) {
		if (err) {return next(err);}
		if (!user) {
			req.flash('error_msg', 'Your username and password does not match');
			return res.redirect('/user/login');
		}
		req.logIn(user, function(err) {
			if (err) {return next(err);}
		// 	var loginPt = new Promise(function(resolve, reject) {
		// 		req.flash('success_msg', 'You are logged in');
				
		// 		function timeToMidnight() {
		// 			console.log('2');
		// 			var now = new Date();
		// 			var end = moment().endOf("day");
		// 			return end - now + 1000;
		// 		}

		// 		function midNightReset() {
				
		// 			var reset = new Promise(function(res, rej) {
		// 				if (flagTwoPt === true) {
		// 					req.flash('success_msg', ' You got two points!');
		// 					var newPoint = req.user.point + 2;
		// 					var query = {'username': req.user.username};
		// 					// Update points in db
		// 					User.findOneAndUpdate(query, {
		// 						'point': newPoint
		// 					}, {upsert: true},
		// 					function(err, user){
		// 						if(err) throw err;
		// 						flagTwoPt = false;
		// 					});
		// 				}	
		// 				resolve();
		// 			});
				
		// 		// Reset the flag at mid might
		// 		reset.then(function() {
		// 			flagTwoPt = true;
		// 			setTimeout(midNightReset, timeToMidnight());
		// 		});
				
		// 	}

		// 	midNightReset();
			
		// 	resolve();
		// });
		
		// loginPt.then(function() {	
		// 		res.redirect('/');
		// });

		});
	})(req, res, next);
});



passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

var newHash = function(query, password){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			User.findOneAndUpdate(query, {
				'password': hash
			}, {upsert: true}, function(err, user){
				if(err) throw err;
			});
		});
	});
};

module.exports = router;
