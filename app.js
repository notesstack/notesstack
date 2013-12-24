var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser({uploadDir:'./public/avatars'}));

var userProvider = require('./UserProvider')
var userProvider= new userProvider();

app.post('/test', function(req, res){
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
	var bio = req.body.bio;
	var access_token = req.body.access_token;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var tmp_path = req.files.avatar.path;
	var avatar_path = tmp_path.split('/');
	var avatar_name = avatar_path[2];

	userProvider.socialLogin(uid, email, username, bio, access_token, firstname, lastname, avatar_name, function(response)	{
		res.json(response);
	});
});

app.post('/profile', function(req, res)	{
	var uid = req.body.uid;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var bio = req.body.bio;
	var tmp_path = req.files.avatar.path;
	var avatar_path = tmp_path.split('/');
	var avatar_name = avatar_path[2];

	userProvider.updateProfile(uid, firstname, lastname, bio, avatar_name, function(response)	{
		res.json(response);
	});
});

app.get('/profile/:uid', function(req, res)	{
	var uid = req.params.uid;

	userProvider.getProfile(uid, function(response)	{
		res.json(response);
	});
});

app.post('/update/new', function(req, res)	{
	var uid = req.body.uid;
	var title = req.body.title;
	var sub_title = req.body.sub_title;
	var content = req.body.content;
	var tags = req.body.tags;
	var categories = req.body.categories;
	var footnote = req.body.footnote;
	var created_at = new Date();
	var published = req.body.published;

	userProvider.createUpdate(uid, title, sub_title, content, tags, categories, footnote, created_at, published, function(response)	{
		res.json(response);
	});
});

app.get('/update/:id', function(req, res)	{
	var id = req.params.id;

	userProvider.findUpdate(id, function(response)	{
		res.json(response);
	});
});

app.post('/update', function(req, res)	{
	var id = req.body._id;
	var uid = req.body.uid;
	var title = req.body.title;
	var sub_title = req.body.sub_title;
	var content = req.body.content;
	var tags = req.body.tags;
	var categories = req.body.categories;
	var footnote = req.body.footnote;
	var published = req.body.published;
	var updated_at = new Date();

	userProvider.updateUpdate(id, uid, title, sub_title, content, tags, categories, footnote, published, updated_at, function(response)	{
		res.json(response);
	});
});

app.get('/updates', function(req, res)	{
	userProvider.findAllUpdate(function(response)	{
		res.json(response);
	});
});

app.post('/comment', function(req, res)	{
	var id = req.body._id;
	var uid = req.body.uid;
	var comment = req.body.comment;
	var created_at = req.body.created_at;

	userProvider.updateComment(id, uid, comment, created_at, function(response)	{
		res.json(response);
	});
});

app.post('/like', function(req, res)	{
	var id = req.body._id;
	var uid = req.body.uid;

	userProvider.updateLike(id, uid, function(response)	{
		res.json(response);
	});
});

app.get('/search/:keystring', function(req, res)	{
	var keystring = req.params.keystring;

	userProvider.getSearch(keystring, function(response)	{
		res.json(response);
	});
});

app.post('/addUid', function(req, res)	{
	var uid = req.body.uid;
	var adduid = req.body.adduid;

	userProvider.addUid(uid, adduid, function(response)	{
		res.json(response);
	});
});

app.delete('/update', function(req, res)	{
	var uid = req.body.uid;
	var id = req.body.id;

	userProvider.deleteUpdate(uid, id, function(response)	{
		res.json(response);
	});
});

app.get('/shuffle', function(req, res)	{
	userProvider.shuffle(function(response)	{
		res.json(response);
	});
});

app.listen(3000);

module.exports = app;
