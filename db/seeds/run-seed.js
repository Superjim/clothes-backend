const devData = require("../data/devData/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
