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
				var hashpassword = hash(password);
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
					callback({RESULT_CODE:'1', MESSAGE:'Login successful', DATA: result.uid});
			}
			else	{
					callback({RESULT_CODE:'1', MESSAGE:'Incorrect password'});
			}
		}
	});
}

UserProvider.prototype.socialLogin = function(uid, email, username, access_token, firstname, lastname, avatar_name, callback)	{
	User.findOne({uid:uid}, function(error, result)	{
		if(error){
			res.json({RESULT_CODE:'-1', MESSAGE:'System error'});
			console.log(JSON.stringify(error));
		}
		else if(result == null)	{
			var hashpassword = hash(access_token);
			var newUser = new User({uid:uid, email: email, username:username, hash: hashpassword, firstname: firstname, lastname: lastname,
											avatar: avatar_name});
			newUser.save(function(err){
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
			var hashpassword = hash(access_token);
			result.email = email;
			result.username = username;
			result.hash = hashpassword;
			result.firstname = firstname;
			result.lastname = lastname;
			result.avatar = avatar_name;
			result.save(function(err)	{
				if(err){
					callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				}
				else	{
					callback({RESULT_CODE:'1', MESSAGE:'Login successful'});
				}
			});
		}
	});
}

UserProvider.prototype.updateProfile = function(uid, firstname, lastname, avatar_name, callback)	{
	User.findOne({uid:uid}, function(error, result)	{
		if(error){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			callback({RESULT_CODE:'-1', MESSAGE:'User does not exist'});
		}
		else
		{
			result.firstname = firstname;
			result.lastname = lastname;
			result.avatar = avatar_name;
			result.save(function(err, sdata)	{
				if(err){
					callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				}
				else	{
					callback({RESULT_CODE:'1', MESSAGE:'Profile updated'});
				}
			});
		}
	});
}

UserProvider.prototype.getProfile = function(uid, callback)	{
	User.findOne({uid:uid}, function(error, result)	{
		if(error){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			callback({RESULT_CODE:'-1', MESSAGE:'User does not exist'});
		}
		else
		{
			var profiledata = {};
			profiledata.username = result.username;
			profiledata.firstname = result.firstname;
			profiledata.lastname = result.lastname;
			profiledata.avatar = result.avatar;
			
			callback(profiledata);
		}
	});
}

module.exports = UserProvider;
