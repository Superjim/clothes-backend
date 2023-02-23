const { addFavourite, fetchUserFavouriteClothes } = require("../models/favourite.models");

function getFavouritesByUserId(req, res, next) {
  const { user_id } = req.params;

  fetchUserFavouriteClothes(user_id)
    .then((userFavouriteClothes) => {
      res.status(200).send({ userFavouriteClothes });
    })
    .catch(next);
}

function postFavouritesByUserId(req, res, next) {
  const { user_id } = req.params;
  const newFavourite = req.body;

  addFavourite(user_id, newFavourite)
    .then((favourite) => {
      res.status(201).send({ favourite });
    })
    .catch(next);
}

module.exports = {
  getFavouritesByUserId,
  postFavouritesByUserId,
};