var fs = require('fs')
var net = require('net')

function getLoad() {
  data = fs.readFileSync("/proc/loadavg");

  var tokens = data.toString().split(' ');
  var min1 = parseFloat(tokens[0]) + 0.01;
  var min5 = parseFloat(tokens[1]) + 0.01;
  var min15 = parseFloat(tokens[2]) + 0.01;
  return min1 * 10 + min5 * 2 + min15;
};

var server = net.createServer(function (c) {
  console.log("Servidor: client connectat.")
  c.on('end', function () {
    console.log("Server down.");
    server.close();
  })
  c.on('data', function (data) {
    var msg = JSON.parse(data);
    console.log("Rebut missatge des de: " + msg.ip_local)
    var ip = msg.ip_server;
    var carrega = getLoad();
    msg = JSON.stringify({"ip_server": ip, "carrega_server": carrega})
    c.write(msg);
    c.end();
    console.log("Servidor: client desconnectat.")
  })
})

server.listen(8000, function () {
  console.log("Server bound.")
})
