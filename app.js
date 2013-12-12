var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser({uploadDir:'./public/avatars'}));

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

app.post('/login/social', function(req, res)	{
	var uid = req.body.uid;
	var email = req.body.email;
	var username = req.body.username;
	var access_token = req.body.access_token;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var tmp_path = req.files.avatar.path;
	var avatar_path = tmp_path.split('/');
	var avatar_name = avatar_path[2];

	userProvider.socialLogin(uid, email, username, access_token, firstname, lastname, avatar_name, function(response)	{
		res.json(response);
	});
});

app.post('/profile', function(req, res)	{
	var uid = req.body.uid;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var tmp_path = req.files.avatar.path;
	var avatar_path = tmp_path.split('/');
	var avatar_name = avatar_path[2];

	userProvider.updateProfile(uid, firstname, lastname, avatar_name, function(response)	{
		res.json(response);
	});
});

app.get('/profile/:uid', function(req, res)	{
	var uid = req.params.uid;

	userProvider.getProfile(uid, function(response)	{
		res.json(response);
	});
});

app.listen(3000);

module.exports = app;
