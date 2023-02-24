const { fetchUserBasket } = require("../models/basket.models");

function getBasketByUserId(req, res, next) {
  const { user_id } = req.params;

  fetchUserBasket(user_id)
    .then((userBasket) => {
      res.status(200).send({ userBasket });
    })
    .catch(next);
}

module.exports = {
  getBasketByUserId,
};