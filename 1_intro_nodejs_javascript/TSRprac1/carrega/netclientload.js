var net = require('net')

var args = process.argv.slice(2);

if (args[0] == "--help" || args.length != 2) {
  console.log("Usage: node netclientload IP_server IP_local")
  process.exit(-1)
}

var ip_server = args[0];
var ip_local = args[1];

var client = net.connect({port:8000},
  function () {
    console.log("Client connectat.");
    var msg = JSON.stringify({"ip_server":ip_server, "ip_local": ip_local});
    client.write(msg);
  }
)

client.on('data', function (data) {
  var msg = JSON.parse(data);
  var ip_server = msg.ip_server
  var carrega = msg.carrega_server
  console.log("M'ha atés el servidor " + ip_server +
              " amb una càrrega " + carrega);
  client.end();
})

client.on('end', function () {
  console.log("Client desconnectat.")
})
