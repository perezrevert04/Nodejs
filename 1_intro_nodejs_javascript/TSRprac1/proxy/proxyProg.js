var net = require('net');

var args = process.argv.slice(2);

if (args[0] == "--help" || args.length != 2) {
  console.log("Usage: node proxProg remote_port remote_ip")
  process.exit(-1);
}

var LOCAL_PORT = 8000;
var LOCAL_PORT_PROG = 8001;
var LOCAL_IP = "127.0.0.1";
var remote_port = args[0];
var remote_ip = args[1];

var server = net.createServer( function (socket) { // servidor per al client
  var serviceSocket = new net.Socket(); // socket per a dialogar amb el servidor

  serviceSocket.connect(parseInt(remote_port),
    remote_ip, function () {
      socket.on('data', function (msg) {
        serviceSocket.write(msg);
      });
      serviceSocket.on('data', function (data) {
        socket.write(data);
      })
    })
}).listen(LOCAL_PORT, LOCAL_IP);

var programer = net.createServer( function (c) {
  console.log("Se ha connectat un programador...")
  c.on('data', function (data) {
    var address = JSON.parse(data);
    remote_port = address.remote_port;
    remote_ip = address.remote_ip;
    console.log("Proxy actualitzat: ara apunta a " + remote_ip + ":" + remote_port);
    c.write("ok");
  });
}).listen(LOCAL_PORT_PROG, LOCAL_IP);

console.log("Servidor TCP acceptant connexió en el port: " + LOCAL_PORT);
