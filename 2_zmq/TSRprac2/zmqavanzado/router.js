var zmq = require('zeromq')
var backend = zmq.socket('router')
var frontend = zmq.socket('router')

var aux = require('./auxfunctions1718.js')

var args = process.argv.slice(2);

if (args[0] == "--help") {
	console.log("node router.js -frontport -backport -v");
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

function processPendingClients(workerID) {
	if(clients.length > 0) {
		var nextClient = clients.shift()
		var msg = [workerID, "", nextClient.id, ""].concat(nextClient.msg);
		backend.send(msg)
		return true
	} else {
		return false
	}
}

function sendToWorker(msg) {
	var clienteID = msg[2], workerID = msg[0]

	if (verbose) {
		console.log("Se ha enviado la petición del cliente (%s) al worker (%s)",
			clienteID, workerID)
		aux.showMessage(msg)
	}
	backend.send(msg)
}

backend.on('message', function () {
	var args = Array.apply(null, arguments)

	if (args.length == 3) {
		var workerID = args[0], connWorker = args[2]
		reqPerWorker[workerID] = 0
		if (verbose)
			console.log("El worker (%s) está ahora disponible: %s", workerID, connWorker)
		if (! processPendingClients(workerID) )
			workers.push(workerID)
	} else {
		var workerID = args[0], clienteID = args[2]
		reqPerWorker[workerID]++
		if (verbose)
			console.log("El worker (%s) ha realizado el trabajo del cliente (%s)", workerID, clienteID)
		frontend.send(args.slice(2))
		if (! processPendingClients(workerID) ) {
			workers.push(workerID)
			if (verbose)
				console.log("El worker (%s) vuelve a estar disponible", workerID)
		}
	}
})

frontend.on('message', function () {
    var args = Array.apply(null, arguments);
	if (workers.length == 0) {
		if (verbose) console.log("El cliente (%s) ha realizado una petición pero no hay workers disponibles actualmente", args[0])
		clients.push( {id: args[0], msg: args[2]} )
	} else {
		var idWorker = workers.shift()
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
