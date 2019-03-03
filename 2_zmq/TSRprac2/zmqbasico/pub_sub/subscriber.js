
var zmq = require('zeromq')

var subscriber = zmq.socket('sub')

var args = process.argv.slice(2)

var verbose = false
if (args[args.length - 1] == "-v") {
  args.pop()
  verbose = true
}

if (args[0] == '--help') {
  console.log("node subscriber -url -suscripcion -v")
  process.exit(0)
} else if (args.length < 2) {
  console.log("Número de argumentos incorrecto:")
  console.log("\tnode subscriber -url -subscribe -v")
  process.exit(-1)
}

var url = args[0]
var suscripcion = args[1]

subscriber.on('message', function (reply) {
  if (verbose)
    console.log("Mensaje recibido ->", reply.toString())
})

if (verbose)
  console.log("Suscrito a", url)
subscriber.connect(url)
subscriber.subscribe(suscripcion)

process.on("SIGINT", function () {
  subscriber.close()
  if (verbose)
    console.log("\nCerrado")
})
