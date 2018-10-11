const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/myDatabase");

const userSchema = new mongoose.Schema({
	name: String,
	password: String,
});
const messagesLog = new mongoose.Schema({
	date: Date,
	username: String,
	content: String
})
const user = mongoose.model('user', userSchema);
const log = mongoose.model('log', messagesLog);
// user.create({
// 	name: "Son",
// 	password: "123"
// })
// log.create({
// 	date: Date.now(),
// 	username: "Ngoc",
// 	content: "An com chua"
// })

// user.findOne({name: "Hoang"}, function(error, result){
// 	if(error){
// 		console.log(error);
// 	}
// 	console.log(result)
// })

user.find().exec(function(error, result){
	console.log(result);
})