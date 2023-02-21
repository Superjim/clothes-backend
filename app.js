const { response } = require("express");
const express = require("express");
const app = express();

const { getClothes } = require("./controller.js");

app.use(express.json());

app.get("/api/clothes", getClothes);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
