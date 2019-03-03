var fs = require('fs')

fs.writeFile('nou_fitxer.txt', 'Contingut del nou fitxer.\n', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  } else {
    console.log("S'ha completat l'escriptura.");
  }
})
