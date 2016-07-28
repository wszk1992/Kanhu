var express = require("express");
var app = express();
require('./router/index')(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var server = app.listen(3000, function() {
	console.log("Express on port 3000!");
});