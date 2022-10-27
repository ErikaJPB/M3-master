const express = require("express");
const app = express();

app.use(express.json()); // for parsing application/json

const sumArray = (array, num) => {
  for (const num1 of array) {
    for (const num2 of array) {
      if (num1 === num2) break;
      if (num1 + num2 === num) return true;
    }
  }
  return false;
};

app.get("/", (req, res) => {
  res.status(200).send({
    message: "hola",
  });
});

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "test",
  });
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  res.status(200).send({
    result: a + b,
  });
});

app.post("/product", (req, res) => {
  const { a, b } = req.body;
  res.status(200).send({
    result: a * b,
  });
});

app.post("/sumArray", (req, res) => {
  const { array, num } = req.body;
  const result = sumArray(array, num);
  res.status(200).send({ result });
});

app.post("/numString", (request, response) => {
  const { str } = request.body;

  if (!str || typeof str === "number") return response.sendStatus(400);
  else {
    const result = str.length;

    return response.status(200).send({ result });
  }
});

app.post("/pluck", (request, response) => {
  const { array, name } = request.body;

  if (!Array.isArray(array) || !name) return response.sendStatus(400);
  else {
    const result = array.map((obj) => obj.name);
    return response.status(200).send({ result });
  }
});

module.exports = app; // Exportamos app para que supertest session la pueda ejecutar
