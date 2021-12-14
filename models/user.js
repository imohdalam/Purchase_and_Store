var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	_id: Number,
	name: String,
	Department: String,
	Role: String,
	username: String,
	password: String,
	passwordConf: String
})

const User = mongoose.model('users', userSchema);

module.exports = User;