const fetchClothes = require("./models/fetchClothes");

function getClothes(req, res, next) {
  fetchClothes()
    .then((clothes) => {
      res.status(200).send({ clothes });
    })
    .catch(next);
}

module.exports = { getClothes };
