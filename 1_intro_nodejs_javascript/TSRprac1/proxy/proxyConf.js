var net = require('net');

var args = process.argv.slice(2);

if (args[0] == "--help" || args.length != 2) {
  console.log("Usage: node proxConf remote_port remote_ip")
  process.exit(-1);
}

var LOCAL_PORT = 8000;
var LOCAL_IP = "127.0.0.1";
var REMOTE_PORT = args[0];
var REMOTE_IP = args[1];

var server = net.createServer( function (socket) { // servidor per al client
  var serviceSocket = new net.Socket(); // socket per a dialogar amb el servidor

  serviceSocket.connect(parseInt(REMOTE_PORT),
    REMOTE_IP, function () {
      socket.on('data', function (msg) {
        serviceSocket.write(msg);
      });
      serviceSocket.on('data', function (data) {
        socket.write(data);
      })
    })
}).listen(LOCAL_PORT, LOCAL_IP);

console.log("Servidor TCP acceptant connexió en el port: " + LOCAL_PORT);
