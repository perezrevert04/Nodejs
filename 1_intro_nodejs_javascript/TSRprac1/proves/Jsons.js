var net = require('net');

var server = net.createServer(
  function (c) {
    c.on('data',
      function (data) {
        var person = JSON.parse(data);

        console.log(person)
        console.log(person.name); // mkyong
        console.log(person.address.street); // 8th Street
        console.log(person.address.city); // New York
        console.log(person.phone[0].number); // 111-1111
        console.log(person.phone[1].number); // 222-2222
      }
    )
    c.on('end', function () {
      console.log("Client disconnected.")
      server.close()
    })
  }
)

server.listen(8000,
  function () { // listening listener
    console.log('Server bound');
  }
)
