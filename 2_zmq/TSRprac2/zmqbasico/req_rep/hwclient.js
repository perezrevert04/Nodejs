// Hello world client
// Connects REQ socket to tcp://localhost:8055
// Sends "Hello" to server.

var zmq = require('zeromq')

var requester = zmq.socket('req')

var args = process.argv.slice(2)

if (args[0] == "--help") {
  console.log("node hwclient -url -numPeticiones -txtPeticion")
  process.exit(0)
} else if (args.length < 3) {
  console.log("Número de argumentos incorrecto:")
  console.log("\tnode hwclient -url -numPeticiones -txtPeticion")
  process.exit(-1)
}

var url = args[0]
var numPeticiones = args[1]
var txtPeticion = args[2]

console.log("Requester conectado a", url, "...")
requester.connect(url)

var x = 0
requester.on('message', function (respuesta) {
  console.log("Respuesta", x++, "recibida ->", respuesta.toString())
  if (x == numPeticiones) {
    requester.close()
    process.exit(0)
  }
})

for (var i = 0; i < numPeticiones; i++) {
  console.log("Enviando mensaje", i, "...")
  requester.send(txtPeticion)
}

process.on("SIGINT", function() {
  requester.close()
  process.exit()
})
