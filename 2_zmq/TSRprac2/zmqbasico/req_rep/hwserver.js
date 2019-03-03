// Hello world server
// Binds REP socket to tcp://*:8055
// Espera "Hello" del cliente y le reponde "world"

var zmq = require('zeromq')

var responder = zmq.socket('rep')

var args = process.argv.slice(2)

if (args[0] == "--help") {
  console.log("node hwserver -puerto -intervaloRespuesta -txtRespuesta")
  process.exit(0)
} else if (args.length < 3) {
  console.log("Número de argumentos incorrecto:")
  console.log("\tnode hwserver -puerto -intervaloRespuesta -txtRespuesta")
  process.exit(-1)
}

var puerto = args[0]
var intervaloRespuesta = args[1]
var txtRespuesta = args[2]

responder.bind("tcp://*:" + puerto, function (err) {
  if (err)
    console.log(err)
  else
    console.log("Responder escuchando en tcp://*:" + puerto + "...")
})

responder.on('message', function (peticion) {
  console.log("Recibido mensaje de petición -> ", peticion.toString())

  setTimeout(function () {
    responder.send(txtRespuesta)
  }, intervaloRespuesta)
})
