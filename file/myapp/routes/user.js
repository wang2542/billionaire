var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var async = require('async');

var nodemailer = require('nodemailer');
var crypto = require('crypto');

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
				return done(null, false, {message: 'User you typed does not exist.'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) done(err);
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Password does not match username.'});
				}
			});
		});
}));


/* GET users listing. */
router.get('/signup', function(req, res, next) {
	//res.send('respond with a resource');
	if (req.user) {
  		req.flash('error_msg', 'invalid Attempt');
  		res.redirect('/');
  	} else {
		res.render('signup');
	}
});

router.get('/login', function(req, res, next) {
  //res.send('respond with a resource');
  	if (req.user) {
  		req.flash('error_msg', 'invalid Attempt');
  		res.redirect('/');
  	} else {
		res.render('login');
	}
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
	req.flash('success_msg', 'Successfully logged Out');
	res.redirect('/');
})


router.get('/resetpw', function(req, res) {
	res.render('resetpw');
})

router.get('/reset/:token', function(req, res) {
		User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function(err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/user/resetpw');
		}
		console.log(user.username);
		res.render('reset', {token: encodeURIComponent(JSON.stringify(req.params.token))});
	});
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
	req.checkBody('password', 'Password can not be less than 6 characters').len(6, 30);
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
			coin: 1000000
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

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }),
  function(req, res) {
	req.flash('success_msg', 'You are logged in');
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

//requesting token
router.post('/resetpw', function(req, res, next) {
	async.waterfall([
		function(done) {
			// Randomly generate a token
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({ email: req.body.email }, function(err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('/user/resetpw');
				}

				user.resetPasswordToken = token;
	        	user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	        	user.save(function(err) {
					done(err, token, user);
	        	});
	    	});
		},
		function(token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'billionaire.cs407@gmail.com',
					pass: 'hihellohi'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'billionaire.cs407@gmail.com',
				subject: 'Billionaire - Account Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/user/reset/' + token + '\r\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
		res.redirect('/user/login');
	});
});

//reset password
router.post('/reset/:token', function(req, res) {
	//console.log('token test');
	console.log(req.params.token);

	//console.log(req.user.username);
	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function(err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					console.log('reset password using token view:reset');
					return res.redirect('back');
				}
				console.log(user.username);
				var newPassword = req.body.password;
				var confirmPassword = req.body.confirmPassword;
				var query = {'username': user.username};
				newHash(query, newPassword);
		        user.resetPasswordToken = undefined;
		        user.resetPasswordExpires = undefined;

       			user.save(function(err) {
					req.logIn(user, function(err) {
						done(err, user);
					});
        		});
    		});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'billionaire.cs407@gmail.com',
					pass: 'hihellohi'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'billionaire.cs407@gmail.com',
				subject: 'Billionaire - Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
	], function(err) {
		res.redirect('/');
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
