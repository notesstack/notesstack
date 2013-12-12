var express = require('express');
var app = express();

app.use(express.bodyParser());

var userProvider = require('./UserProvider')
var userProvider= new userProvider();

app.get('/test', function(req, res){
	res.json({RESULT_CODE:'1', MESSAGE:'Server running'});
});

app.post('/signup', function(req, res){
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;

	userProvider.signup(email, username, password, function(response)	{
		res.json(response);
	});
});

app.post('/login', function(req, res)	{
	var email = req.body.email;
	var password = req.body.password;

	userProvider.login(email, password, function(response)	{
		res.json(response);
	});
});

/*	
app.post('/login/facebook', function(req, res)	{
	var fbid = req.body.fbid;
	var username = req.body.username;
	var password = req.body.password;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var avatar = req.body.avatar;

	UpdateProvider.facebook(fbid, username, password, firstname, lastname, avatar, function(response)	{
		res.json(response);
	});
});

*/

app.listen(3000);

module.exports = app;
