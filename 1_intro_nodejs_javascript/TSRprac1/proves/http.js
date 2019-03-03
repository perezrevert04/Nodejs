var http = require('http'); // Importa el mòdul http

function dd(i) { return (i < 10 ? "0" : "") + i; } // pe: dd(8) = "08", dd(16) = "16"

var server = http.createServer( // crea el servidor
  function(req, res) { // li associa una funció al servidor
    res.writeHead(200, { 'Content-Type':'text/html' })
    res.end('<marquee>Node & Http</marquee>'); // retorna una resposta
    var d = new Date ();
    console.log('Algú ha accedit a les ' + // escriu l'hora d'accés en la consola
                d.getHours() + ":" +
                dd(d.getMinutes()) + ":" +
                dd(d.getSeconds())
    );
  }
).listen(8000); // El servidor escolta en el port 8000
