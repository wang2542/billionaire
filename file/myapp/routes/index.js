var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var news = require('../model/news.js');
var localStorage = require('localStorage');
var stock = require('../model/stock');
var stockInfo = require('../model/stockInfo');
var User = require('../model/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  	news.getNews(function(result){
	  	//var json = JSON.parse(result['posts'][0]);
	  	//console.log(result);

	  	//console.log(result['posts'][0]['title']);
	  	//console.log(result['posts'][0]['text']);
	  	//console.log(result['posts'][0]['url']);
	  	if (!req.user) {
		  	res.render('index', {
		    	title_1 : result['posts'][0]['title'],
		    	url_1 : result['posts'][0]['url'],
		    	author_1 : result['posts'][0]['author'],
		    	title_2 : result['posts'][3]['title'],
		    	url_2 : result['posts'][3]['url'],
		    	author_2 : result['posts'][3]['author'],
		    	title_3 : result['posts'][2]['title'],
		    	url_3 : result['posts'][2]['url'],
		    	author_3 : result['posts'][2]['author']
		 	});	
	  	} else {
	  		res.render('index', {
	  			title_1 : result['posts'][0]['title'],
		    	url_1 : result['posts'][0]['url'],
		    	author_1 : result['posts'][0]['author'],
		    	title_2 : result['posts'][3]['title'],
		    	url_2 : result['posts'][3]['url'],
		    	author_2 : result['posts'][3]['author'],
		    	title_3 : result['posts'][2]['title'],
		    	url_3 : result['posts'][2]['url'],
		    	author_3 : result['posts'][2]['author'],
				username: req.user.username
			});
	  	}
 	});
});
router.get('/about' , function(req,res,next){
	res.render('about');
});

router.get('/blank_page' , function(req,res,next){
	res.render('blank_page');
});
router.get('/new_signin' , function(req,res,next){
	res.render('new_signin');
});
router.get('/new_login' , function(req,res,next){
	res.render('new_login');
});
router.get('/index-6' , function(req,res,next){
    res.render('index-6');
});
router.get('/new_profile' , function(req,res,next){
    res.render('new_profile');
});
router.get('/contact' , function(req,res,next){
    res.render('contact');
});
router.get('/game', function(req, res, next) {
	if (!req.user) {
  		req.flash('error_msg', 'Login Required!');
  		res.redirect('/');
	} else {
		res.render('game');
	}
});

router.post('/contact/send', function(req, res, next) {
	var smtpTransport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'billionaire.cs407@gmail.com',
			pass: 'hihellohi'
		}
	});

	var mailOptions = {
		from: '"billionaire " <billionaire.cs407@gmail.com>', //sender address
		to: 'li1800@purdue.edu, pangr@purdue.edu, kcha@purdue.edu, wang2542@purdue.edu, fu157@purdue.edu', //list of receivers
		subject: 'Feedback from Billionaire: Subj' + req.body.subject, //Subject line
		text: 'You have a submission from Name: ' + req.body.username + 'Email: ' + req.body.email+ 'Message: ' + req.body.message, //plain text body
		html: '<p>You have a submission from </p> <ul><li>Name: ' + req.body.username + '</li><li>Email: ' + req.body.email+ '</li><li>subject: ' + req.body.subject + '</li><li>Message: ' + req.body.message + '</li></ul>'//html body
	};

	smtpTransport.sendMail(mailOptions, function(error, info) {
		if(error) {
			return console.log(error);
		}
		console.log('Message Sent: ' + info.response);
		res.redirect('/contact');
	});

});





module.exports = router;
