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
	  	stockInfo.searchPriceByFamousSymbol(function(callback) {
	  		//console.log(callback);
	  		//console.log(callback['AAPL']['quote']['latestPrice']);
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
			    	author_3 : result['posts'][2]['author'],
			    	aapl : callback['AAPL']['quote']['latestPrice'],
			    	amzn : callback['AMZN']['quote']['latestPrice'],
			    	goog : callback['GOOG']['quote']['latestPrice'],
			    	nflx : callback['NFLX']['quote']['latestPrice'],
			    	adbe : callback['ADBE']['quote']['latestPrice'],
			    	gs : callback['GS']['quote']['latestPrice'],
			    	jpm : callback['JPM']['quote']['latestPrice'],
			    	c : callback['C']['quote']['latestPrice'],
			    	ms : callback['MS']['quote']['latestPrice'],
			    	bx : callback['BX']['quote']['latestPrice'],
			    	ibm : callback['IBM']['quote']['latestPrice']
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
			    	aapl : callback['AAPL']['quote']['latestPrice'],
			    	amzn : callback['AMZN']['quote']['latestPrice'],
			    	goog : callback['GOOG']['quote']['latestPrice'],
			    	nflx : callback['NFLX']['quote']['latestPrice'],
			    	adbe : callback['ADBE']['quote']['latestPrice'],
			    	gs : callback['GS']['quote']['latestPrice'],
			    	jpm : callback['JPM']['quote']['latestPrice'],
			    	c : callback['C']['quote']['latestPrice'],
			    	ms : callback['MS']['quote']['latestPrice'],
			    	bx : callback['BX']['quote']['latestPrice'],
			    	ibm : callback['IBM']['quote']['latestPrice'],
					username: req.user.username
				});
		  	}
	  	});
 	});
});
router.get('/about' , function(req,res,next){
	res.render('about', {
		user : req.user
	});
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
    res.render('contact', {
    	user : req.user
    });
});
router.get('/knowledge' , function(req,res,next){
    res.render('knowledge');
});
router.get('/tutorial' , function(req,res,next){
    res.render('tutorial');
});
router.get('/strategies' , function(req,res,next){
    res.render('strategies');
});

router.get('/game', function(req, res, next) {
	if (!req.user) {
  		req.flash('error_msg', 'Login Required!');
  		res.redirect('/');
	} else {
		stockInfo.searchPriceByFamousSymbol(function(callback) {
			 res.render('game', {
			    aapl : callback['AAPL']['quote']['latestPrice'],
			    amzn : callback['AMZN']['quote']['latestPrice'],
			    goog : callback['GOOG']['quote']['latestPrice'],
			    nflx : callback['NFLX']['quote']['latestPrice'],
			    adbe : callback['ADBE']['quote']['latestPrice'],
			    gs : callback['GS']['quote']['latestPrice'],
			    jpm : callback['JPM']['quote']['latestPrice'],
			    c : callback['C']['quote']['latestPrice'],
			    ms : callback['MS']['quote']['latestPrice'],
			    bx : callback['BX']['quote']['latestPrice'],
			    ibm : callback['IBM']['quote']['latestPrice'],
			    user : req.user
			 });	
	  	});
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
		var user = null;
		if(error) {
			return console.log(error);
		}
		if (req.user) 
			user = req.user
		console.log('Message Sent: ' + info.response);
		res.redirect('/contact', {user:user});
	});

});

router.post('/contact/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/contact');
});

router.post('/about/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/about');
});



module.exports = router;
