var mongoose = require('mongoose');
var Schema = mongoose.Schema;

reqinfo = new Schema( {
	_id: Number,
	full_name: String,
	username: String,
	Department: String,
	product_name: String,
	Category: String,
	quantity: Number
})

const rqst = mongoose.model('checkouts', reqinfo);

module.exports = rqst;