var express = require('express');
var url = require('url');
var router = express.Router();

router.get('/', logincheck);
router.get('/', function(req, res) {
	res.render('index.html', {title: 'Kanhu', username: req.session.user});
});

router.get('/login', logoutcheck);
router.get('/login', function(req, res) {
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
router.get('/logout', logincheck);
router.get('/logout', function(req, res) {
	req.session.user = null;
	req.session.error = null;
	res.redirect("/login");
});

router.get('/register', logoutcheck);
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

router.get('/user/:id', logincheck);
router.get('/user/:id', function(req, res) {
	var id = req.params.id;
	var User = global.dbHandel.getModel('user');
	var Question = global.dbHandel.getModel('question');
	var Answer = global.dbHandel.getModel('answer');
	User.findOne({username: id}, function(err, doc) {
		if(err) {
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else if(doc) {
			if(id == req.session.user) {
				Question.find({user: id},null,{sort:{_id:-1}}, function(err, docq) {
					if(err) {
						console.log(err);
						req.session.error = 'Internet Error';
						res.sendStatus(500);
					}
					Answer.find({user: id},null,{sort:{_id:-1}}, function(err, doca) {
						if(err) {
							console.log(err);
							req.session.error = 'Internet Error';
							res.sendStatus(500);
						}
						res.render('user.html', {username: id, myQuestions: docq, myAnswers: doca});
					});
					
				});
				
				
			}else {
				//TODO: visit other's profile
				req.session.error = "Cannot browse other's profile yet";
				res.redirect("/");
			}
		}else {
			req.session.error = "No such user";
			res.sendStatus(404);
		}
	});
});

router.post('/user/:id/questions', function(req, res) {
	if(req.params.id != req.session.user) {
		req.session.error = "Cannot post the question on others' account";
		res.redirect('/');
	}
	var Question = global.dbHandel.getModel('question');
	Question.create({
		title: req.body.question_title,
		detail: req.body.question_details,
		user: req.params.id
		}, function(err, doc) {
					if(err) {
						console.log(err);
						res.sendStatus(500);
					}else {
						console.log('post question successfully');
						//req.session.success = 'post question successfully';
						//res.sendStatus(200);
						//TODO: redirect to question page
						res.redirect("/user/" + req.params.id);
					}
	});
});

// router.post('questions/:qid', function(req, res) {
// 	console.log("begin remove the question from db");
// 	var qid = req.params.qid;
// 	var Question = global.dbHandel.getModel('question');
// 	var Answer = global.dbHandel.getModel('answer');
// 	Question.remove({_id:qid}, function(err) {
// 		if(err) {
// 			console.log(err);
// 			res.sendStatus(500);
// 		}else {
// 			Answer.remove({questionId: qid}, function(err) {
// 				if(err) {
// 					console.log(err);
// 					res.sendStatus(500);
// 				}else {
// 					console.log("remove the question from db");
// 					res.redirect('/questions');
// 				}
// 			});
// 		}
// 	});
// });

router.get("/questions", logincheck);
router.get("/questions", function(req, res) {
	var Question = global.dbHandel.getModel('question');
	Question.find({},null,{sort:{_id:-1}}, function(err, doc) {
		if(err) {
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else {
			res.render('questions.html', {questions: doc, username: req.session.user});
		}
	});
});

router.post('/questions/:id', function(req, res) {
	//TODO: prevent post when the user doesn't login(no session)
	var Answer = global.dbHandel.getModel('answer');
	var Question = global.dbHandel.getModel('question');
	Question.findOne({_id: req.params.id}, function(err, docq) {
		if(err) {
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else if(docq) {
			Answer.create({
				questionId: docq._id,
				questionTitle: docq.title,
				user: req.session.user,
				body: req.body.answer_body
			}, function(err) {
						if(err) {
							console.log(err);
							res.sendStatus(500);
						}else {
							console.log('post answer successfully');
							//req.session.success = 'post question successfully';
							//res.sendStatus(200);
							//TODO: redirect to question page
							res.redirect("/questions/" + req.params.id);
						}
			});
		}else {
			req.session.error = "No such question";
			res.sendStatus(404);
		}
	})
	
});

router.get('/questions/:id', logincheck);
router.get('/questions/:id', function(req, res) {
	var id = req.params.id;
	var userId = req.session.user;
	var Question = global.dbHandel.getModel('question');
	var Answer = global.dbHandel.getModel('answer');
	var Vote = global.dbHandel.getModel('vote');
	var docq, doca;
	Question.findOne({_id: id}).exec(function(err, doc) {
		if(err) {
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else if(!doc) {
			req.session.error = "No such question";
			res.sendStatus(404);
		}else {
			docq = doc;
		}
	});

	Answer.find({questionId: id},null,{sort:{_id:1}}).exec(function(err, doc) {
		if(err) {
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else {
			doca = doc;
		}
	});

	Vote.find({questionId: id, user: userId}, null, {sort:{answerId:1}}).exec(function(err, docv) {
		if(err) {
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else {
			res.render('question.html', {title: docq.title, question: docq, answers: doca, votes: docv, username: userId});
		}
	});
});

router.get('/users', logincheck);
router.get('/users', function(req, res) {
	var User = global.dbHandel.getModel('user');
	User.find({}, function(req, doc) {
		res.send(doc);
	});
});

router.get('/answers/:id/:v', logincheck);
router.get('/answers/:id/:v', function(req, res) {
	var Answer = global.dbHandel.getModel('answer');
	var Vote = global.dbHandel.getModel('vote');
	var userId = req.session.user;
	var voted = req.query.status;
	var id = req.params.id;
	var flag = req.params.v;
	var doca;
	console.log("status: " + voted);
	Answer.findOne({_id: id}).exec(function(err, doc) {
		if(err) {
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else if(!doc) {
			req.session.error = "No such answer";
			res.sendStatus(404);
		}else {
			if(flag == "vote")
				if(voted == '1') {
					doc.votes--;
				}else {
					doc.votes++;
				}
			else {
				if(voted == '1') {
					doc.vetos--;
				}else {
					doc.vetos++;
				}
			}
			doc.save();
			doca = doc;
			console.log(doc.votes);
		}
	});
	Vote.findOne({answerId: id, user: userId}).exec(function(err, docv) {
		if(err) {
			console.log(err);
			req.session.error = 'Internet Error';
			res.sendStatus(500);
		}else if(!docv) {
			if(voted == '1') {
				req.session.error = "No such vote";
				res.sendStatus(500);
			}else {
				if(flag == "vote") {
					Vote.create({
						questionId: doca.questionId,
						answerId: id,
						user: userId,
						vote: 1
					}, function(err) {
						if(err) {
							console.log(err);
							res.sendStatus(500);
						}else {
							console.log("create vote successfully!");
						}
					});
				}else {
					Vote.create({
						questionId: doca.questionId,
						answerId: id,
						user: userId,
						veto: 1
					}, function(err) {
						if(err) {
							console.log(err);
							res.sendStatus(500);
						}else {
							console.log("create veto successfully!");
						}
					});
				}
			}
		}else {
			if(flag == "vote") {
				docv.vote = !docv.vote;
			}else {
				docv.veto = !docv.veto;
			}
			console.log("change the vote/veto");
			docv.save();
		}
	});
});

router.get('/about', function(req, res) {
	res.render('about.html',{username: req.session.user});
});

function logincheck(req, res, next) {
	if(!req.session.user){
		//res.session.error = "Please login first!";
        return res.redirect("/login");                
    }
    next();
}

function logoutcheck(req, res, next) {
	if(req.session.user) {
		//res.session.error = "Please logout first!";
		return res.redirect("/");
	}
	next();
}

module.exports = router;