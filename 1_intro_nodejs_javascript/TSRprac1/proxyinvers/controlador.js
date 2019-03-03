var net = require('net');

var args = process.argv.slice(2)

if (args[0] == "--help" || args.length < 3) {
  console.log("Usage: node controlador ip_proxy port_proxy_prog new_remote_ip new_remote_port");
  process.exit(-1);
}

var PORT_PROXY = 8000;
var IP_PROXY = args[0];
var PORT_PROXY_PROG = args[1];
var NEW_REMOTE_IP = args[2];
var NEW_REMOTE_PORT = args[3];

var programer = net.connect({port: PORT_PROXY, host: IP_PROXY}, function () {
  console.log("El controlador s'ha conectat al proxy: " + IP_PROXY + ":" + PORT_PROXY);
  var msg = JSON.stringify(
    {"op":"set",
    'inPort':PORT_PROXY_PROG,
    'remote':{'ip':NEW_REMOTE_IP,'port':NEW_REMOTE_PORT}}
  );
  programer.write(msg);

programer.on('end', function () {
  console.log("Controlador desconnectat.")
})

  programer.on('data', function () {
    console.log("El proxy ha sigut actualitzat correctament!");
    programer.end();
  })
})
