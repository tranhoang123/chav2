var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var messengerSchema = new Schema({
	id : Number,
	username : String,
	content : String,
	date: Date
})

module.exports = {
	getModel: function getModel(connection){
		return connection.model("messenges", messengerSchema);
	}
};