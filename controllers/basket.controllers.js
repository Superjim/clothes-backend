const { fetchUserBasket, addClothesToBasket, removeBasket } = require("../models/basket.models");

function getBasketByUserId(req, res, next) {
  const { user_id } = req.params;

  fetchUserBasket(user_id)
    .then((userBasket) => {
      res.status(200).send({ userBasket });
    })
    .catch(next);
}

function postClothesToBasketByUserId(req, res, next) {
  const { user_id } = req.params;
  const newClothesForPurchase = req.body;

  addClothesToBasket(user_id, newClothesForPurchase)
    .then((clothesBasket) => {
      res.status(201).send({ clothesBasket });
    })
    .catch(next);
}

function deleteBasket(req, res, next) {
  const { basket_id } = req.params;
  
  removeBasket(basket_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = {
  getBasketByUserId,
  postClothesToBasketByUserId,
  deleteBasket,
};