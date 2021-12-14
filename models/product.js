var mongoose = require('mongoose');
var Schema = mongoose.Schema;

prodSchema = new Schema( {
	_id: Number,
    product_name: String,
    Stock:Number,
    Category:String
})

const Prod = mongoose.model('module', prodSchema,'product');

module.exports = Prod;