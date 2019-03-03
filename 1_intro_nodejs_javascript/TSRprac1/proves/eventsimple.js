var ev = require('events');
var emitter = new ev.EventEmitter;

var i1 = "imprimir", i2 = "llegir"; // noms dels esdeveniments
var n1 = 0, n2 = 0; // variables auxiliars

// registra les funcions listener per a les emissions dels esdeveniments
emitter.on(i1,
  function () {
      console.log('Esdeveniment ' + i1 + ': ' + (++n1) + ' vegades.');
  }
)

emitter.on(i2,
  function () {
    console.log('Esdeveniment ' + i2 + ': ' + (++n2) + ' vegades.');
  }
)

emitter.on(i1, // més d'un listener per al mateix esdeveniment és possible
  function () {
    console.log("Alguna cosa ha sigut impresa!")
  }
)

// genera esdeveniments periòdicament
setInterval(
  function () { emitter.emit(i1);}, 2000
) // genera i1 cada 2 segons

setInterval(
  function () { emitter.emit(i2);}, 8000
) // genera i2 cada 8 segons
