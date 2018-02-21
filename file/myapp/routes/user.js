var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var async = require('async');
var User = require('../model/user');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

//Deploy local strategy of passport
passport.use(new LocalStrategy( function(username, password, done) {
		console.log('username, password:', username, password);
		User.getUserByUsername(username, function(err, user){
			if(err) done(err);
			if(!user){
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) done(err);
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
				console.log(user);
				return res.redirect('/user/login');
				});
				req.flash('success_msg', 'You are registered and can now login.');
			}
		});
			
		}

});

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login' }),
  function(req, res) {
    res.redirect('/');
 });

router.post('/profile', function(req, res, next){

	// Get the updated information
	var newEmail = req.body.email;
	var newPassword = req.body.password;
	var newConfirmPassword = req.body.passwordConfirm;

	var query = {'username': req.user.username};

	// update password
	if (newPassword === newConfirmPassword) {	
		// user does not type password
		if (newPassword.length === 0) {
			User.findOneAndUpdate(query, {
				'email': newEmail || '',
			}, {upsert: true},
			function(err, user){
				if(err) throw err;
				// Validation
				req.checkBody('email', 'Email is not valid').isEmail();
				if (newPassword.length !== 0) {
					req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
				}
				var errors = req.validationErrors();
				if(errors){
					req.flash('error_msg', 'Your email is not valid or your password cannot be less than 6');
					res.redirect('/user/profile');
				} else {
					user.save(function(err){
						if (err) {
							return next(err);
						}
						req.flash('success_msg', 'Profile information has been updated.');
						res.redirect('/user/profile');
						});
				}
			});
		} else {
			// Validation
			req.checkBody('email', 'Email is not valid').isEmail();
			if (newPassword !== 0) {
				req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
			}
			var errors = req.validationErrors();
			console.log(errors);
			if(errors){
				req.flash('error_msg', 'Your email is not valid or your password cannot be less than 6');
				res.redirect('/user/profile');
			} else {
				var newHashedPw = newHash(query, newPassword);
				User.findOneAndUpdate(query, {
					'email': newEmail || '',
					'password': newHashedPw
				}, {upsert: true},
				function(err, user){
					if(err) throw err;
					user.save(function(err){
						if (err) {
							return next(err);
						}
						req.flash('success_msg', 'Profile information has been updated.');
						res.redirect('/user/profile');
					});	
				});
			}
		}			
	}
	else {
		req.flash('error_msg', 'Password does not match');
	}
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
