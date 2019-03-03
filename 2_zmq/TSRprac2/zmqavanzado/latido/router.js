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

const intervaloRespuesta = 2000;
var workersOcupados = []

function processPendingClients(workerID) {
	if(clients.length > 0) {
		var nextClient = clients.shift()
		var msg = [workerID, "", nextClient.id, ""].concat(nextClient.msg);
		sendToWorker(msg)
		return true
	} else {
		return false
	}
}

function sendToWorker(msg) {
	var clienteID = msg[2], workerID = msg[0]

	backend.send(msg)
	workersOcupados[workerID] = {}
	workersOcupados[workerID].msg = msg.slice(2)

	if (verbose) {
		console.log("Se ha enviado la petición del cliente (%s) al worker (%s)",
			clienteID, workerID)
		console.log("El worker (%s) se encuentra ahora ocupado", workerID)
		aux.showMessage(msg)
	}

	workersOcupados[workerID].timeout = setTimeout(
		generateTimeoutHandler(workerID),
		intervaloRespuesta
	);
}

function generateTimeoutHandler(workerID) {
	return function () {
		var msg = workersOcupados[workerID].msg;
		delete workersOcupados[workerID]
		sendRequest(msg)
	}
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
		clearTimeout(workersOcupados[workerID].timeout)
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

		var clienteID = args[0]
		if (verbose)
			console.log("El cliente (%s) ha realizado una petición de trabajo", clienteID)

		sendRequest(args)
})

function sendRequest(msgs) {

		if (workers.length == 0) {
			var clienteID = msgs[0], clienteMsg = msgs[2]
			if (verbose)
				console.log("El cliente (%s) ha realizado una petición pero no hay workers disponibles actualmente", clienteID)
			clients.push( {id: clienteID, msg: clienteMsg} )
		} else {
			var idWorker = workers.shift()
			msg = [idWorker, ""].concat(msgs)
			sendToWorker(msg)
		}
}

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
