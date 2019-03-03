var net = require('net');

var args = process.argv.slice(2)

if (args[0] == "--help" || args.length < 3) {
  console.log("Usage: node programador ip_proxy new_remote_ip new_remote_port");
  process.exit(-1);
}

var IP_PROXY = args[0];
var NEW_REMOTE_IP = args[1];
var NEW_REMOTE_PORT = args[2];

var programer = net.connect({port: 8001, host: IP_PROXY}, function () {
  console.log("El programador s'ha conectat al proxy: " + IP_PROXY + ":" + 8001);
  var msg = JSON.stringify({"remote_ip":NEW_REMOTE_IP, "remote_port":NEW_REMOTE_PORT});
  programer.write(msg);

programer.on('end', function () {
  console.log("Programador desconnectat.")
})

  programer.on('data', function () {
    console.log("El proxy ha sigut actualitzat correctament!");
    programer.end();
  })
})
