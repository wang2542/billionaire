var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

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
		    	title_2 : result['posts'][1]['title'],
		    	url_2 : result['posts'][1]['url'],
		    	author_2 : result['posts'][1]['author']
		 	});	
	  	} else {
	  		res.render('index', {
	  			title_1 : result['posts'][0]['title'],
		    	url_1 : result['posts'][0]['url'],
		    	author_1 : result['posts'][0]['author'],
		    	title_2 : result['posts'][1]['title'],
		    	url_2 : result['posts'][1]['url'],
		    	author_2 : result['posts'][1]['author'],
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
router.get('/index' , function(req,res,next){
    res.render('index');
});
router.get('/new_profile' , function(req,res,next){
    res.render('new_profile');
});
router.get('/game', function(req, res, next) {
	if (!req.user) {
  		req.flash('error_msg', 'Login Required!');
  		res.redirect('/');
	} else {
		res.render('game');
	}
});





module.exports = router;
