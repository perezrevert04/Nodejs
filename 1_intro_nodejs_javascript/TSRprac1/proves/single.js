function fib (n) {
  return (n < 2) ? 1 : fib (n - 2) + fib(n - 1);
}

console.log("Iniciant execució...");

setTimeout( // espera 10 ms quan comença la funció
  function () {
    console.log('M1 -> Vull escriure!')
  }, 10);

var j = fib (40); // pren més d'1 segon

function otherMsg(m, o) {
  console.log(m + " -> El resultat és " + o + ".");
}

otherMsg("M2", j); // M2 apareix abans que M1 com a fil principal

setTimeout( // M3 apareix després que M1
 function() {otherMsg('M3', j);}, 1
)
