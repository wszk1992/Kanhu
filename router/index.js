var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
 	if(!req.session.user){                     //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    } 
	res.render('index.html', {title: 'Kanhu', username: req.session.user});
});


router.get('/login', function(req, res) {
	if(req.session.user){                     //到达/home路径首先判断是否已经登录
        res.redirect("/");                //未登录则重定向到 /login 路径
    } 
	res.render('login.html', {title: 'Login'});
});

router.post('/login', function(req, res) {
	//get user info
	var User = global.dbHandel.getModel('user');
	User.findOne({username: req.body.username}, function(err, doc) {
		if(err) {
			res.send(500);
			console.log(err);
		}else if(!doc) {
			console.log("This user doesn't exit");
			req.session.error = "This user doesn't exit";
			res.redirect("/login");
		}else {
			if(req.body.password != doc.password) {
				console.log("Wrong password");
				req.session.error = "Wrong password";
				res.redirect('/login');
			}else {
				console.log("login successfully");
				req.session.user = doc.username;
				res.redirect('/');
			}
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.user = null;
	req.session.error = null;
	res.redirect("/login");
});

router.get('/register', function(req, res) {
	res.render('register.html', {title: 'Register'});
});

router.post('/register', function(req, res) {
	//console.log("get post request!");
	var User = global.dbHandel.getModel('user');
	var uname = req.body.username;
	var upwd = req.body.password;
	var upwd1 = req.body.password1;
	if(upwd !== upwd1) {
		console.log("Passwords are not same");
		req.session.error = 'Passwords are not same';
		res.redirect("/register");
	}else {
		User.findOne({username: uname}, function(err, doc) {
			if(err) {
				console.log(err);
				req.session.error = 'Internet Error';
				res.sendStatus(500);
			}else if(doc) {
				req.session.error = 'Username is already in use';
				// res.sendStatus(500);
				res.redirect("/register");
			}else {
				User.create({
					username: uname,
					password: upwd
				}, function(err, doc) {
					if(err) {
						console.log(err);
						res.sendStatus(500);
					}else {
						req.session.user = uname;
						req.session.success = 'User is created successfully';
						//res.sendStatus(200);
						res.redirect("/");
					}
				});
			}
		});
	}
});

router.get('/user/:id', function(req, res) {
	console.log("enter /user/id");
	var id = req.params.id;
	var User = global.dbHandel.getModel('user');
	User.findOne({username: id}, function(err, doc) {
		if(err) {
			console.log("something wrong");
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else if(doc) {
			if(id == req.session.user) {
				console.log("go to user profile");
				res.render('user.html', {username: id});
			}else {
				console.log("Cannot browse other's profile yet");
				req.session.error = "Cannot browse other's profile yet";
				res.redirect("/");
			}
		}else {
			console.log("no such user");
			req.session.error = "No such user";
			res.sendStatus(404);
		}
	});
});

router.get('/about', function(req, res) {
	res.render('about.html');
});



module.exports = router;