var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var spawn = require('child_process').spawn;
var myProcess = null;
var port = 3000;
var running=false;

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
	socket.on('helloServer', (data) => {
		console.log(data.msg);
		socket.emit('helloClient', {
  			msg: 'Server to client: GOT U!'
		});
	});

	socket.on('scan-command',(data)=> {
  		console.log(JSON.stringify(data.msg)+"\n");
		let args = [];
		for(let arg in data.msg) {args.push(data.msg[arg]); console.log(arg)}
		myProcess = spawn('docker', args);
		running=true;
		myProcess.stdout.setEncoding('utf8');
		myProcess.stdout.on('data', function (data) {
			socket.emit('output', data);
		});
		myProcess.stderr.setEncoding('utf8');
		myProcess.stderr.on('data', function (data) {
  			socket.emit('output', data);
		});
		myProcess.on('close', (code) => {
			running=false;
  			console.log(`child process exited with code ${code}`);
		});
	});

	socket.on('abort',()=> {
		if(!running){
			console.log("nothing to kill");
			socket.emit('killed', "Nothing to abort. Let's execute something!\r\n");
		}
		else{
			console.log("KILLED PROCESS!");
			myProcess.kill();
			socket.emit('killed', "Session aborted.\r\n");
		}
	});
});

server.listen(port, () => {
	console.log("Listening on port " + port);
});