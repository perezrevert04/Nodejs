
var zmq = require('zeromq')
var aux = require('./auxfunctions1718.js')

var publisher = zmq.socket('pub')

var args = process.argv.slice(2)

var verbose = false
if (args[args.length - 1] == "-v") {
  args.pop()
  verbose = true
}

if (args[0] == '--help') {
  console.log("node publisher -puerto -numMensajes -tiposMsg -v")
  process.exit(0)
} else if (args.length < 2) {
  console.log("Número de argumentos incorrecto:")
  console.log("\tnode publisher -puerto -numMensajes -tiposMsg -v")
  process.exit(-1)
}

var puerto = args[0]
var numMensajes = args[1]
var tiposMsg = args.slice(2)
var numTipos = tiposMsg.length

publisher.bind("tcp://*:" + puerto, function (err) {
  if (err)
    console.log(err)
  else
    if (verbose)
      console.log("Publisher enviando a tcp://*:", puerto, "...")
})

function enviar(valor) {
  setTimeout(function () {
    if (verbose)
      console.log("Enviado ->", tiposMsg[valor % numTipos])
    publisher.send(tiposMsg[valor % numTipos] + ": " + aux.randNumber(100, 10))
  }, 1000 * valor);
}

for (var i = 1; i <= numMensajes; i++) {
  enviar(i)
}

process.on("SIGINT", function () {
  publisher.close()
  if (verbose)
    console.log("\nCerrado")
})
