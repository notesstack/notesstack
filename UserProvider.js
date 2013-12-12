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

var Comments = new Schema({
    uid     : String
  , comment    : String
  , created_at : Date
});

var Post = new Schema({
	uid	: String
	, title	: String
	, sub_title : String
  , content	: String
	, tags : [String]
	, categories : [String]
	, footnote : [String]
	, restacked : [String]
	, likes : [String]
	, likes_count : [String]
	, shared : [String]
  , created_at  : Date
	, updated_at	: Date
	, published : {type: Boolean, default:false} 
	, read_by_admin : {type: Boolean, default:false}
  , comments    : [Comments]
});

mongoose.model('Post', Post);
var Post = mongoose.model('Post');


UserProvider = function(){};

UserProvider.prototype.signup = function(email, username, password, callback)	{
		User.findOne({email: email}, function(err, result)	{
			if(err){
				callback({RESULT_CODE:'-1', MESSAGE:'System error'});
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
	User.findOne({uid:uid}, function(err, result)	{
		if(err){
			res.json({RESULT_CODE:'-1', MESSAGE:'System error'});
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
	User.findOne({uid:uid}, function(err, result)	{
		if(err){
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
			result.save(function(err)	{
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
	User.findOne({uid:uid}, function(err, result)	{
		if(err){
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

UserProvider.prototype.createUpdate = function(uid, title, sub_title, content, tags, categories, footnote, restacked, created_at, callback)	{
	User.findOne({uid: uid}, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			callback({RESULT_CODE:'-1', MESSAGE:'User does not exist'});
		}
		else
		{
			var update = new Post({uid: uid, title: title, sub_title: sub_title, content:content, tags:tags, categories: categories,
													restacked: restacked, created_at: created_at});
			result.save(function(err)	{
				if(err){
					callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				}
				else	{
					callback({RESULT_CODE:'1', MESSAGE:'Update created'});
				}
			});
		}
	});
}

UserProvider.prototype.findUpdate = function(id, callback)	{
	Post.findById(id, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			callback({RESULT_CODE:'-1', MESSAGE:'Update does not exist'});
		}
		else
		{
			callback({RESULT_CODE:'1', DATA: result});
		}
	});
}

UserProvider.prototype.updateUpdate = function(id, uid, title, sub_title, content, tags, categories, footnote, restacked, updated_at, callback)	{
	User.findOne({uid: uid}, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			callback({RESULT_CODE:'-1', MESSAGE:'User does not exist'});
		}
		else
		{
			Post.findById(id, function(err, result)	{
				if(err){
					callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				}
				else if(result == null)	{
					callback({RESULT_CODE:'-1', MESSAGE:'Update does not exist'});
				}
				else if(result.uid == uid)	{
					result.title = title;
					result.sub_title = sub_title;
					result.content = content;
					result.tags = tags;
					result.categories =  categories;
					result.restacked = restacked;
					result.updated_at = updated_at;
					result.save(function(err)	{
						if(err){
							callback({RESULT_CODE:'-1', MESSAGE:'System error'});
						}
						else	{
							callback({RESULT_CODE:'1', MESSAGE:'Update updated'});
						}
					});
				}
				else	{
						callback({RESULT_CODE:'-1', MESSAGE:'User cannot edit update'});
				}
			});
		}
	});
}

UserProvider.prototype.findAllUpdate = function(callback)	{
	Post.find({}, {limit:10}, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else
		{
			callback({RESULT_CODE:'1', DATA: result});
		}
	});
}

UserProvider.prototype.updateComment = function(id, uid, comment, created_at, callback)	{
	User.findOne({uid: uid}, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			callback({RESULT_CODE:'-1', MESSAGE:'User does not exist'});
		}
		else	{
			Post.findById(id, function(err, result)	{
				if(err){
					callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				}
				else if(result == null)	{
					callback({RESULT_CODE:'-1', MESSAGE:'Post does not exist'});
				}
				else
				{
					var comment = {uid : uid, comment: comment, created_at: created_at};
					result.comments.push(comment);
					result.save(function(err)	{
						if(err){
							callback({RESULT_CODE:'-1', MESSAGE:'System error'});
						}
						else	{
							callback({RESULT_CODE:'1', MESSAGE:'Comment updated'});
						}
					});
				}
			});
		}
	});
}

UserProvider.prototype.updateLike = function(id, uid, callback)	{
	User.findOne({uid: uid}, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			callback({RESULT_CODE:'-1', MESSAGE:'User does not exist'});
		}
		else	{
			Post.findById(id, function(err, result)	{
				if(err){
					callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				}
				else if(result == null)	{
					callback({RESULT_CODE:'-1', MESSAGE:'Post does not exist'});
				}
				else
				{
					result.likes.push(uid);
					result.save(function(err)	{
						if(err){
							callback({RESULT_CODE:'-1', MESSAGE:'System error'});
						}
						else	{
							callback({RESULT_CODE:'1', MESSAGE:'Like updated'});
						}
					});
				}
			});
		}
	});
}

module.exports = UserProvider;
