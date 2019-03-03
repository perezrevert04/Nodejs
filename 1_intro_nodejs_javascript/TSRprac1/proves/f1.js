var fs = require('fs')

fs.readFile('nou_fitxer.txt', 'utf8', function (err, data) {
  if (err)
    return console.log(err);
  else
    console.log(data)
})
