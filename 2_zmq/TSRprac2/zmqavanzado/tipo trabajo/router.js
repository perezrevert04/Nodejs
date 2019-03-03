var zmq = require('zeromq')
var backend = zmq.socket('router')
var frontend = zmq.socket('router')

var aux = require('./auxfunctions1718.js')

var args = process.argv.slice(2);

if (args[0] == "--help") {
	console.log("node router.js -frontport -backport -classIDs -v");
	process.exit(0);
}

var verbose = (args[args.length - 1] == "-v") ? true : false
if (verbose) args.pop()
var frontport = args[0] || '8000'
var backport = args[1] || '8001'

frontend.bindSync("tcp://*:" + frontport)
backend.bindSync("tcp://*:" + backport)
if (verbose) {
	console.log("Frontend, puerto:", frontport);
	console.log("Backend, puerto:", backport);
}

var workers = []
var clients = []

var reqPerWorker = []

const classIDs = (args.slice(2) != 0) ? args.slice(2) : ['R', 'G', 'B']
if (verbose)
	console.log("Tipos de trabajo:")
for (var elem in classIDs) {
	workers[classIDs[elem]] = []
	clients[classIDs[elem]] = []
	if (verbose)
		console.log("\t" + elem + ". " + classIDs[elem])
}

function processPendingClients(workerID, classID) {
	if(clients[classID].length > 0) {
		var nextClient = clients[classID].shift()
		var msg = [workerID, "", nextClient.id, "", nextClient.msg].concat(nextClient.wtype);
		backend.send(msg)
		return true
	} else {
		return false
	}
}

function sendToWorker(msg) {
	var clienteID = msg[2]
	var workerID = msg[0]
	var classID = msg[5]
	if (verbose) {
		console.log("Se ha enviado la petición del cliente (%s - %s) al worker (%s - %s)",
			clienteID, classID, workerID, classID)
		aux.showMessage(msg)
	}
	backend.send(msg)
}

backend.on('message', function () {
	var args = Array.apply(null, arguments)

	if (args.length == 4) {
		var workerID = args[0], mensaje = args[2], classID = args[3]
		reqPerWorker[workerID] = 0
		if (verbose)
			console.log("El worker (%s - %s) está ahora disponible: %s",
				workerID, classID, mensaje)
		if (! processPendingClients(workerID, classID) )
			workers[classID].push(workerID)
	} else {
		var workerID = args[0], clienteID = args[2], classID = args.pop()
		reqPerWorker[args[0]]++

		if (verbose)
			console.log("El worker (%s - %s) ha realizado el trabajo del cliente (%s)",
				workerID, classID, clienteID)
		frontend.send(args.slice(2))
		if (! processPendingClients(workerID, classID) ) {
			workers[classID].push(workerID)
			if (verbose)
				console.log("El worker (%s - %s) vuelve a estar disponible", workerID, classID)
		}
	}
})

frontend.on('message', function () {
    var args = Array.apply(null, arguments);
		var clienteID = args[0]
		var msgCliente = args[2]
		var classID = args[3];

	if (workers[classID].length == 0) {
		if (verbose)
			console.log("El cliente (%s - %s) ha realizado una petición pero no hay workers disponibles actualmente",
				clienteID, classID)
		clients[classID].push( {id: clienteID, msg: msgCliente, wtype: classID} )
	} else {
		var idWorker = workers[classID].shift()
		msg = [idWorker, ""].concat(args)
		sendToWorker(msg)
	}
})

function showStatistitcs() {
	var trabajosTotales = 0
	for (var i in reqPerWorker) {
		if (verbose) console.log("El worker (%s) ha realizado %d trabajos", i, reqPerWorker[i])
		trabajosTotales += reqPerWorker[i]
	}
	if (verbose) console.log("Se han realizado un total de %d trabajos", trabajosTotales);
	process.exit(0)
}

process.on('SIGINT', function () {
	if (verbose) console.log("Se ha detectado control-C...")
	setTimeout(showStatistitcs, 5000)
})
