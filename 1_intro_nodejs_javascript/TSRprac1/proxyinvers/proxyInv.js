var net = require('net');

var args = process.argv.slice(2);

if (args[0] == "--help") {
  console.log("Usage: node proxInv")
  process.exit(-1);
}

var LOCAL_PORT_PROG = 8000;
var LOCAL_IP = "127.0.0.1";

var ports = [];
ports[8001] = {"ip":"158.42.184.5","port":80}; // www.dsic.upv.es
ports[8002] = {"ip":"158.42.4.23","port":80}; // www.upv.es
ports[8003] = {"ip":"89.238.68.168","port":80}; // www.libreoffice.org
ports[8004] = {"ip":"158.42.179.56","port":8080}; // memex.dsic.upv.es
ports[8005] = {"ip":"147.156.222.65","port":80}; // www.cdllibre.org

for (var local_port = 8001; local_port <= 8008; local_port++) {
  crearServidors(local_port);
}

function crearServidors(local_port) {
  var server = net.createServer( function (socket) {
    if (ports[local_port] != undefined) {
      var serviceSocket = new net.Socket();

      serviceSocket.connect(ports[local_port].port, ports[local_port].ip, function () {
        serviceSocket.on('data', function (data) {
          socket.write(data);
        });
        socket.on('data', function (data) {
          serviceSocket.write(data);
        })
      });
    } else {
      console.log("El puerto " + local_port + " del proxy no está operativo...");
    }
  }).listen(local_port, LOCAL_IP);
  console.log("Servidor TCP acceptant connexió en el port: " + local_port);
}

var programer = net.createServer( function (c) {
  c.on('data', function (data) {
    var msg = JSON.parse(data)

    ports[msg.inPort].ip = msg.remote.ip;
    ports[msg.inPort].port = msg.remote.port;

    console.log("El port " + msg.inPort + " ara apunta a " + msg.remote.ip + ":" + msg.remote.port)
    c.write("ok")
  });
}).listen(LOCAL_PORT_PROG, LOCAL_IP);
