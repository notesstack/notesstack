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
,	bio: String
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
	, likes_count : Number
	, shared : [String]
  , created_at  : Date
	, updated_at	: Date
	, published : {type: Boolean, default:true} 
	, read_by_admin : {type: Boolean, default:false}
	, crew_picks : {type: Boolean, default:false}
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
						callback({RESULT_CODE:'1', MESSAGE:'User registered', DATA:result});
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

UserProvider.prototype.socialLogin = function(uid, email, username, bio, access_token, firstname, lastname, avatar_name, callback)	{
	User.findOne({uid:uid}, function(err, result)	{
		if(err){
			res.json({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			var hashpassword = hash(access_token);
			var newUser = new User({uid:uid, email: email, username:username, bio: bio, hash: hashpassword, firstname: firstname, lastname: lastname,
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

UserProvider.prototype.updateProfile = function(uid, firstname, lastname, bio, avatar_name, callback)	{
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
			result.bio = bio;
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
			profiledata.uid = result.uid;
			profiledata.username = result.username;
			profiledata.avatar = result.avatar;
			profiledata.bio = result.bio;

			Post.find({uid:uid}, {title:1, sub_title:1, tags:1, categories:1, likes:1, restacked:1, published:1, comments:1}, {limit:10}, function(err, result)	{
				if(err){
					callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				}
				else
				{
					callback({RESULT_CODE:'1', DATA: {profile: profiledata, posts: result}});
				}
			});
		}
	});
}

UserProvider.prototype.createUpdate = function(uid, title, sub_title, content, tags, categories, footnote, created_at, callback)	{
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
													created_at: created_at});
			update.save(function(err, result)	{
				if(err){
					callback({RESULT_CODE:'-1', MESSAGE:'System error'});
				}
				else	{
					callback({RESULT_CODE:'1', MESSAGE:'Update created', DATA:result});
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

UserProvider.prototype.updateUpdate = function(id, uid, title, sub_title, content, tags, categories, footnote, updated_at, callback)	{
	User.findOne({uid: uid}, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else if(result == null)	{
			callback({RESULT_CODE:'-1', MESSAGE:'User does not exist'});
		}
		else
		{
			var username = result.username;
			var avatar = result.avatar;

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
					result.updated_at = updated_at;
					result.save(function(err, post)	{
						if(err){
							callback({RESULT_CODE:'-1', MESSAGE:'System error'});
						}
						else	{
							var up = {};
							up.uid = uid;
							up.title = post.title;
							up.sub_title = post.sub_title;
							up.content = post.content;
							up.tags = post.tags;
							up.categories = post.categories;
							up._id = post._id;
							up.username = username;
							up.avatar = avatar;
							up.read_by_admin = post.read_by_admin;
							up.likes = post.likes;
							up.comments = post.comments;
							up.restacked = post.restacked;
							
							callback({RESULT_CODE:'1', DATA:up});
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
	Post.find({published:true}, {}, {limit:10}, function(err, result)	{
		if(err){
			callback({RESULT_CODE:'-1', MESSAGE:'System error'});
		}
		else
		{
			var uids = [];
			result.forEach(function(user)	{
				uids.push(user.uid);
			});				
			userProfile(uids, function(err, users)	{
				var posts = [];
				result.forEach(function(user)	{
					var post = {};
					post.uid = user.uid;
					post.title = user.title;
					post.sub_title = user.sub_title;
					post.tags = user.tags;
					post.categories = user.categories;
					post._id = user._id;
					post.username = users[user.uid].username;
					post.avatar = users[user.uid].avatar;
					post.created_at = user.created_at;
					post.likes = user.likes;
					post.restacked = user.restacked;
					post.published = user.published;
					post.comments = user.comments;
					posts.push(post);
				});
				callback({RESULT_CODE:'1', DATA: posts});
			});
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

function userProfile(uid, callback)	{
	User.find({uid:{$in:uid}}, {uid:1, username:1, avatar:1}, function(err, result)	{
		if(err){
			callback(err);
		}
		else
		{
			var profiledata = {};
			result.forEach(function(user)	{
				profiledata[user.uid] = {username:user.username, avatar:user.avatar};
			});				
			callback(null, profiledata);
		}
	});
}

module.exports = UserProvider;
