module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index.html', {title: 'Kanhu'});
	});
	app.get('/login', function(req, res) {
		res.render('login.html');
	});
	app.get('/about', function(req, res) {
		res.render('about.html');
	});
	app.get('/register', function(req, res) {
		res. render('register.html', {title: 'Register in Kanhu'});
	});
}