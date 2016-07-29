var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('index.html', {title: 'Kanhu'});
});
router.get('/login', function(req, res) {
	res.render('login.html');
});
router.get('/about', function(req, res) {
	res.render('about.html');
});
router.get('/register', function(req, res) {
	res. render('register.html', {title: 'Register in Kanhu'});
});


module.exports = router;