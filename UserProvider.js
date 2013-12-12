var mongoose = require('mongoose');

var password = require('./utils/password.js');
var hash = password.hash;
var validate = password.validate;
var uniqueId = password.uniqueId;

mongoose.connect('mongodb://localhost/notesstack');

var Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var User = new Schema({
	email: String
,	uid: String
,	username: String
,	hash: String
,	firstname: {type: String, default: ''}
,	lastname: {type: String, default: ''}
,	avatar: {type: String, default: ''}
});

mongoose.model('User', User);
var User = mongoose.model('User');

UserProvider = function(){};

UserProvider.prototype.signup = function(email, username, password, callback)	{
		User.findOne({email: email}, function(err, result)	{
			if(err){
				callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				console.log(JSON.stringify(err));
			}
			else if(result == null){
				var hashpassword = hash(password)
				var uid = uniqueId();
				var newUser = new User({ email: email, username:username, hash: hashpassword, uid:uid});
				newUser.save(function(err, result){
					if(err)
					{
						callback({RESULT_CODE:'-1', MESSAGE:'System error'});
					}
					else
					{
						callback({RESULT_CODE:'1', MESSAGE:'User registered'});
					}
				});
			}
			else
			{
				callback({RESULT_CODE:'-1', MESSAGE:'User exists'});
			}
		});
}

UserProvider.prototype.login = function(email, password, callback)	{
	User.findOne({email: email}, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
			console.log(JSON.stringify(err));
		}
		else if(result == null){
			callback({RESULT_CODE:'1', MESSAGE:'User does not exist'});
		}
		else	{
			if(validate(result.hash, password))	{
					callback({RESULT_CODE:'1', MESSAGE:'Login successful'});
			}
			else	{
					callback({RESULT_CODE:'1', MESSAGE:'Incorrect password'});
			}
		}
	});
}

module.exports = UserProvider;
