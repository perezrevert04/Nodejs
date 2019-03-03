var net = require('net')

var client = net.connect( {port:8000},
  function () { // connect listener
    console.log('Client connectat.')
    client.write('món!\r\n');
  }
);

client.on('data',
  function (data) {
    console.log(data.toString());
    client.end(); // no more data written to the stream
  }
);

client.on('end',
  function () {
    console.log("Client desconnectat.")
  }
)
