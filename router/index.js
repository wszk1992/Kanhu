var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	if(!req.session.user) {
		req.session.error = "Please Login first";
		res.redirect('/login');
	}
	res.render('index.html', {title: 'Kanhu'});
});

router.get('/login', function(req, res) {
	res.render('login.html', {title: 'Login'});
}).post(function(req, res) {
	//get user info
	var User = global.dbHandel.getModel('user');
	var uname = req.body.uname;
	User.findOne({username: uname}, function(err, doc) {
		if(err) {
			res.send(500);
			console.log(err);
		}else if(!doc) {
			req.session.error = "This user doesn't exit";
			res.send(404);
			//res.redirect("/login");
		}else {
			if(req.body.upwd != doc.password) {
				req.session.error = "Wrong password";
				res.send(404);
				//res.redirect('/login');
			}else {
				req.session.user = doc;
				res.send(200);
				//res.redirect('/home');
			}
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.user = null;
	req.session.error = null;
	res.redirect("/");
});

router.get('/register', function(req, res) {
	res. render('register.html', {title: 'Register'});
}).post(function(req, res) {
	console.log("get post request!");
	var User = global.dbHandel.getModel('user');
	var uname = req.body.uname;
	var upwd = req.body.upwd;
	User.findOne({name: uname}, function(err, doc) {
		if(err) {
			res.send(500);
			req.session.error = 'Internet Error';
			console.log(err);
		}else if(doc) {
			req.session.error = 'Username is already in use';
			res.send(500);
		}else {
			User.create({
				username: uname,
				password: upwd
			}, function(err, doc) {
				if(err) {
					res.send(500);
					console.log(err);
				}else {
					req.session.error = 'User is created successfully';
					res.send(200);
				}
			});
		}
	});
});

router.get('/about', function(req, res) {
	res.render('about.html');
});

module.exports = router;