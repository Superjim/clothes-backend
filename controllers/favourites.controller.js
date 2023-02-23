const { fetchFavourites } = require("../models/favourite.models");

function getFavouritesByUserId(req, res, next) {
  const { user_id } = req.params;

  fetchFavourites(user_id)
    .then((favourites) => {
      res.status(200).send({ favourites });
    })
    .catch(next);
}

module.exports = {
  getFavouritesByUserId,
};