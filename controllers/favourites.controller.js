const { fetchFavourites, addFavourite } = require("../models/favourite.models");

function getFavouritesByUserId(req, res, next) {
  const { user_id } = req.params;

  fetchFavourites(user_id)
    .then((favourites) => {
      res.status(200).send({ favourites });
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