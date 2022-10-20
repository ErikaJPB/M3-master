"use strict";

var Promise = require("bluebird"),
  async = require("async"),
  exerciseUtils = require("./utils");

var readFile = exerciseUtils.readFile,
  promisifiedReadFile = exerciseUtils.promisifiedReadFile,
  blue = exerciseUtils.blue,
  magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function (st) {
  return st.toUpperCase();
});

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE,
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function (arg) {
  var problem = module.exports["problem" + arg];
  if (problem) problem();
});

function problemA() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loggea el poema dos stanza uno y stanza dos en cualquier orden
   *    pero loggea 'done' cuando ambos hayan terminado
   *    (ignora errores)
   *    nota: lecturas ocurriendo paralelamente (en simultaneo)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  // ???

  const promiseOne = promisifiedReadFile("poem-two/stanza-01.txt");

  const promiseTwo = promisifiedReadFile("poem-two/stanza-02.txt");

  Promise.all([promiseOne, promiseTwo]).then((stanzas) => {
    stanzas.forEach((stanza) => blue(stanza));
    // blue(stanzas[0]);
    // blue(stanzas[1]);
    console.log("done");
  });
}

function problemB() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea todas las stanzas en poema dos, en cualquier orden y loggea
   *    'done' cuando todas hayan terminado
   *    (ignora errores)
   *    nota: las lecturas ocurren en paralelo (en simultaneo)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });

  // // callback version
  // async.each(
  //   filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log("-- B. callback version --");
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log("-- B. callback version done --");
  //   }
  // );

  // promise version
  // ???

  //   const promises = filenames.map((file) =>
  //     promisifiedReadFile(file).then((stanza) => blue(stanza))
  //   );

  //   Promise.all(promises).then(() => {
  //     console.log("done");
  //   });
  // }

  const promises = filenames.map((file) => promisifiedReadFile(file));

  Promise.all(promises).then((stanzas) => {
    stanzas.forEach((stanza) => blue(stanza));
    console.log("done");
  });
}

function problemC() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. Lee y loggea todas las stanzas en el poema dos, *en orden* y
   *    loggea 'done cuando hayan terminado todas
   *    (ignorá errores)
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });

  // callback version
  // async.eachSeries(
  //   filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log("-- C. callback version --");
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log("-- C. callback version done --");
  //   }
  // );

  // promise version
  // ???

  //todo: sacarlo con for
  // for (let i = 1, p = promisifiedReadFile(filenames[0]); i <= filenames.length; i++) {
  //   p = p.then((stanza) => {
  //     blue(stanza);
  //     if(i === filenames.length) {
  //       console.log('done');
  //     } else {
  //       return promisifiedReadFile(filenames[i]);
  //     }
  //   })
  // }

  // }

  const promises = filenames.map((file) => promisifiedReadFile(file));

  Promise.all(promises).then((stanzas) => {
    stanzas.forEach((stanza) => blue(stanza));
    console.log("done");
  });
}

//   filenames
//     .reduce((promise, file) => {
//       // promesa -> acumulador | file = filenames
//       return promise.then((stanza) => {
//         if (stanza) blue(stanza);
//         return promisifiedReadFile(file); // promesa = promisified con el poema 1 , vuelve y empieza
//       });
//     }, Promise.resolve(false)) //valor inicial de promesa es false
//     .then((stanza) => {
//       blue(stanza);
//       console.log("done");
//     });
// }

function problemD() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea todas las stanzas en el poema dos *en orden* asegurandote
   *    de fallar para cualquier error y logueando un 'done cuando todas
   *    hayan terminado
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = "wrong-file-name-" + (randIdx + 1) + ".txt";

  // callback version
  // async.eachSeries(
  //   filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log("-- D. callback version --");
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(new Error(err));
  //     console.log("-- D. callback version done --");
  //   }
  // );

  // promise version
  // ???

  //   filenames
  //     .reduce((promise, file) => {
  //       // promesa -> acumulador | file = filenames
  //       return promise.then((stanza) => {
  //         if (stanza) blue(stanza);
  //         return promisifiedReadFile(file); // promesa = promisified con el poema 1 , vuelve y empieza
  //       });
  //     }, Promise.resolve(false)) //valor inicial de promesa es false
  //     .then((stanza) => {
  //       blue(stanza);
  //       console.log("done");
  //     })
  //     .catch((error) => {
  //       magenta(new Error(error));
  //       console.log("done");
  //     });
  // }

  const promises = filenames.map((file) => promisifiedReadFile(file));

  Promise.all(promises)
    .then((stanzas) => {
      stanzas.forEach((stanza) => blue(stanza));
      console.log("done");
    })
    .catch((error) => {
      magenta(new Error(error));
      console.log("done");
    });
}

function problemE() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Haz una versión promisificada de fs.writeFile
   *
   */

  var fs = require("fs");
  function promisifiedWriteFile(filename, str) {
    // tu código aquí

    return new Promise((resolve, reject) => {
      fs.writeFile(filename, str, (error) => {
        if (error) return reject(error);
        resolve("Se escribio bien");
      });
    });
  }
}
