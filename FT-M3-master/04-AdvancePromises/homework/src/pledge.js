"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/

/* The `` class is a constructor function that takes an executor function as an argument. The
executor function is called immediately and is passed two functions, `resolve` and `reject`. The
`resolve` function is called when the asynchronous operation is successful and the `reject` function
is called when the asynchronous operation is unsuccessful. The `` class has a `then` method
that takes two functions as arguments, `successHandler` and `errorHandler`. The `successHandler`
function is called when the asynchronous operation is successful and the `errorHandler` function is
called when the asynchronous operation is unsuccessful */

// class $Promise {
//   constructor(executor) {
//     if (typeof executor !== "function")
//       throw new TypeError("Executor must be a function");

//     this._state = "pending";
//     this._value = undefined;
//     this._handlerGroups = [];

//     const callbackHandlers = (value) => {
//       while (this._handlerGroups.length > 0) {
//         const { successCb, errorCb, downstreamPromise } =
//           this._handlerGroups.shift();

//         if (this._state === "fulfilled") {
//           // no tengo success handler
//           if (!successCb) downstreamPromise._internalResolve(value);
//           else {
//             //Tengo success handler
//             try {
//               const result = successCb(value);
//               // 1 - Retornado una promesa
//               if (result instanceof $Promise) {
//                 result.then(
//                   (value) => downstreamPromise._internalResolve(value),
//                   (error) => downstreamPromise._internalReject(error)
//                 );
//               } else {
//                 // 2 - un valor
//                 downstreamPromise._internalResolve(result);
//               }
//             } catch (error) {
//               // 3 - error
//               downstreamPromise._internalReject(error);
//             }
//           }
//         }

//         if (this._state === "rejected") {
//           if (!errorCb) downstreamPromise._internalReject(value);
//           else {
//             try {
//               const result = errorCb(value);
//               if (result instanceof $Promise) {
//                 result.then(
//                   (value) => downstreamPromise._internalResolve(value),
//                   (error) => downstreamPromise._internalReject(error)
//                 );
//               } else {
//                 downstreamPromise._internalResolve(result);
//               }
//             } catch (error) {
//               downstreamPromise._internalReject(error);
//             }
//           }
//         }

//         // this._state === "fulfilled" &&
//         //   currentHandler.successCb &&
//         //   currentHandler.successCb(value);

//         // this._state === "rejected" &&
//         //   currentHandler.errorCb &&
//         //   currentHandler.errorCb(value);
//       }
//     };

//     this._internalResolve = (value) => {
//       if (this._state === "pending") {
//         this._state = "fulfilled";
//         this._value = value;
//         callbackHandlers(this._value);
//       }
//     };
//     this._internalReject = (reason) => {
//       if (this._state === "pending") {
//         this._state = "rejected";
//         this._value = reason;
//         callbackHandlers(this._value);
//       }
//     };

//     const resolve = (value) => this._internalResolve(value);

//     const reject = (reason) => this._internalReject(reason);

//     executor(resolve, reject);

//     this.then = (successHandler, errorHandler) => {
//       const downstreamPromise = new $Promise(() => {});
//       const handlerGroup = {
//         successCb:
//           typeof successHandler === "function" ? successHandler : false,
//         errorCb: typeof errorHandler === "function" ? errorHandler : false,
//         downstreamPromise,
//       };

//       this._handlerGroups.push(handlerGroup);
//       this._state !== "pending" && callbackHandlers(this._value);
//       return downstreamPromise;
//     };

//     this.catch = (errorHandler) => {
//       return this.then(null, errorHandler);
//     };
//   }

//   static resolve(value) {
//     if (value instanceof $Promise) return value;
//     const newPromise = new $Promise(() => {});
//     newPromise._internalResolve(value);
//     return newPromise;
//   }

//   static all(arr) {
//     if (!Array.isArray(arr)) throw TypeError("arr must be array");
//   }
// }

class $Promise {
  constructor(executor) {
    if (typeof executor !== "function")
      throw TypeError("Executor must be a function");
    this._state = "pending";
    this._value = undefined;
    this._handlerGroups = [];

    const callHandlers = (value) => {
      //cada uno un then
      // handlerGroups --->[{sucessCb, errorCb}{sucessCb, errorCb}{sucessCb, errorCb}{sucessCb, errorCb}] va a tomar el primero y sacarlo y analizar si es fulfilled or reject

      while (this._handlerGroups.length) {
        //const currentHandler = this._handlerGroups.shift(); // successCb, errorCb, downstreamPromise
        const { successCb, errorCb, downstreamPromise } =
          this._handlerGroups.shift(); // <-- vienen de currenthandler

        if (this._state === "fulfilled") {
          // si no tengo success handler
          if (!successCb) downstreamPromise._internalResolve(value);
          else {
            try {
              //si tengo success handler
              const result = successCb(value);
              // si retorna una promesa
              if (result instanceof $Promise) {
                result.then(
                  (value) => downstreamPromise._internalResolve(value),
                  (reason) => downstreamPromise._internalReject(reason)
                );
              } else {
                //si retorna un valor
                downstreamPromise._internalResolve(result);
              }
            } catch (error) {
              //si arroja error
              downstreamPromise._internalReject(error);
            }
          }
        }

        if (this._state === "rejected") {
          if (!errorCb) downstreamPromise._internalReject(value);
          else {
            try {
              const result = errorCb(value);
              if (result instanceof $Promise) {
                result.then(
                  (value) => downstreamPromise._internalResolve(value),
                  (reason) => downstreamPromise._internalReject(reason)
                );
              } else {
                downstreamPromise._internalResolve(result);
              }
            } catch (error) {
              downstreamPromise._internalReject(error);
            }
          }
        }

        // this._state === "fulfilled" &&
        //   currentHandler.successCb &&
        //   currentHandler.successCb(value);

        // this._state === "rejected" &&
        //   currentHandler.errorCb &&
        //   currentHandler.errorCb(value);
      }
    };

    this._internalResolve = (value) => {
      if (this._state !== "pending") return;

      this._state = "fulfilled";
      this._value = value;
      callHandlers(this._value);
    };

    this._internalReject = (reason) => {
      if (this._state !== "pending") return;
      this._state = "rejected";
      this._value = reason;
      callHandlers(this._value);
    };

    const resolve = (value) => {
      this._internalResolve(value);
    };
    const reject = (reason) => {
      this._internalReject(reason);
    };

    executor(resolve, reject);

    this.then = (successHandler, errorHandler) => {
      const downstreamPromise = new $Promise(() => {});
      const handlerGroup = {
        successCb:
          typeof successHandler === "function" ? successHandler : false,
        errorCb: typeof errorHandler === "function" ? errorHandler : false,

        downstreamPromise,
      };

      this._handlerGroups.push(handlerGroup);
      this._state !== "pending" && callHandlers(this._value);

      return downstreamPromise;
    };

    this.catch = (errorHandler) => {
      return this.then(null, errorHandler);
    };
  }

  static resolve(value) {
    if (value instanceof $Promise) return value;

    const promise = new $Promise(() => {});
    promise._internalResolve(value);
    return promise;
  }

  static all(array) {
    if (!Array.isArray(array)) throw TypeError("Argument must be an array");
  }
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
