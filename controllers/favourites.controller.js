const { addFavourite, fetchUserFavouriteClothes, removeFavourite } = require("../models/favourite.models");

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

function deleteFavourite(req, res, next) {
  const { favourite_id } = req.params;
  
  removeFavourite(favourite_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = {
  getFavouritesByUserId,
  postFavouritesByUserId,
  deleteFavourite,
};