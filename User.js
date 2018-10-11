var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
	username: String,
	password: String,
	message:{
	date : Date,
	content: String
	}
})
module.exports = {
	getModel: function getModel(connection){
	return connection.model("User", userSchema);
	}
};