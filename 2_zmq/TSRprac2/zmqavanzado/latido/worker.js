var zmq = require('zeromq')
var worker = zmq.socket('req')

var args = process.argv.slice(2);

if (args[0] == "--help") {
	console.log("node worker.js -url -id -msgConnection -msgReply -v");
	process.exit(0);
}

var verbose = (args[args.length - 1] == "-v") ? true : false
if (verbose) args.pop()
var url = args[0] || "tcp://localhost:8001"
var myID = args[1] || 'NONE'
var msgConn = args[2] || "Hola"
var msgReply = args[3] || "Mundo"
	
if (myID != 'NONE')
	worker.identity = myID

worker.connect(url)
if (verbose) console.log("Worker (%s) conectado en %s", myID, url);

worker.on('message', function () {
    var args = Array.apply(null, arguments);
	if (verbose)
			console.log("Worker (%s) ha recibido del cliente (%s) el mensaje: %s", myID, args[0], args[2])
	args[2] = msgReply
	worker.send(args)
});

worker.send(msgConn)
if (verbose) console.log("Worker (%s) ha enviado el mensaje de conexión: %s", myID, msgConn)