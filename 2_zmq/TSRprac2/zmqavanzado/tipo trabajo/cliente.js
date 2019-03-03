var zmq = require('zeromq')
var cliente = zmq.socket('req')

var args = process.argv.slice(2);

if (args[0] == "--help") {
	console.log("node cliente.js -url -id -msgConnection -classID -v");
	process.exit(0);
}

var verbose = (args[args.length - 1] == "-v") ? true : false
if (verbose) args.pop()
var url = args[0] || "tcp://localhost:8000"
var myID = args[1] || 'NONE'
var msgConn = args[2] || "Hola"
var classID = args[3] || "B"

if (myID != "NONE")
	cliente.identity = myID

cliente.connect(url)
if (verbose)
	console.log("El cliente (%s - %s) conectado en %s", myID, classID, url);

cliente.on('message', function (msg) {
	console.log('Mensaje recibido:', msg.toString());
	process.exit(0);
});

cliente.send([msgConn, classID]);
if (verbose)
	console.log("El cliente (%s - %s) ha enviado el mensaje de conexión: %s",
		myID, classID, msgConn)
