var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/myDatabase");
const userSchema = new mongoose.Schema({
	username: String,
	password: String,
});
const messagesLog = new mongoose.Schema({
	date: Date,
	username: String,
	content: String
})
const user = mongoose.model('user', userSchema);
const log = mongoose.model('log', messagesLog);

app.get('/', function(req,res){ // kết nối với namespace mặc định '/'
	res.sendfile("index.html");
});

// user = [];
var client = 0;
io.on('connection', function(socket){ // bắt sự kiện user kết nối với server
	console.log("Một người vừa kết nối.");
	client++;
	//console.log("so client hien tai: "+client)
	socket.on('setUsername', function(data){
		console.log(data.username +" tren cung");
		user.findOne({"username": data.username}, function(error, result){
			console.log(result);
			//console.log(result.username+ " so voi "+data.username);
			if(error) console.log(error);
			else if (result != null){
			if(result.username === data.username){
				//console.log(result.username+" hihi")
				socket.emit("existedName", "Tên đã tồn tại.");
				//
			}}else{
				
				//console.log(result.username + "haha");
				socket.emit("setName", {username : data.username});
				user.create({
					username: data.username,
					password: data.password
				});
				//console.log(data.username+ " "+data.password),
				//console.log("Đã đăng ký")
			}
		})
		}) 
	socket.on("checkUsername", function(data){
		user.findOne({"username": data.username}, function(error, result){
			if (error) console.log(error);
			if(result != null){
				if(result.password !== data.password){
					socket.emit("logFail", "Sai tên hoặc mật khẩu");
				}
				else if(result.password === data.password){
					socket.emit("logged", "Đăng nhập thành công");
					setTimeout(function(){socket.emit("setName", {username : result.username }); },1000);
					//socket.emit("setName", {username : result.username });
				}
			}
			else{
				socket.emit("logFail", "Sai tên hoặc mật khẩu");
			}
		});
	});

	socket.on("loadMessage", function(data){
		console.log("loadMessage catched");
		log.find().exec(function(error, result){
					//console.log(result);
			socket.emit("tranferData", { logs: result});						
		})
		//console.log("kieu cua log la: "+ typeof logs);
		
		io.sockets.emit("numberOnline", {number: client});
		});
		socket.on('disconnect', function(data){
		client--;
		io.sockets.emit("numberOnline", {number:client});
		//console.log("so nguoi hien tai: "+ client);
		})
	socket.on('sendMessage', function(data){ // bắt sự kiện 'sendMessage'
		io.sockets.emit('newmsg', data); // phát gói tin 'newmsg' cho tất cả các người đang kết nối
		log.create({
			date: Date.now(),
			username: data.user,
			content: data.message
		});
		// console.log(typeof log.find().exec(function(error, result){ console.log(result)}));
	});
});


http.listen(3000, function(){
	console.log('listening on port 3000');
});