// Per a que el client puga connectar-se primer ha d'haver un servidor disponible
var net = require('net');

var server = net.createServer(
  function (c) { // connection listener
    console.log('Servidor: client connectat.');
    c.on('end',
      function () {
        console.log('Servidor: client desconnectat.');
      }
    );
    c.on('data',
      function (data) { // send resp
        c.write('Hola\r\n' + data.toString());
        c.end(); // close socket
      }
    )
  } // fi function
) // fi create server

server.listen(8000,
  function () {
    console.log('Server bound');
  }
)
