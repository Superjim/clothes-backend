const fetchClothes = require("./models/fetchClothes");
const fetchSuggestedClothes = require("./models/fetchSuggestedClothes");
const fetchUserByUserId = require("./models/fetchUserByUserId");
const patchUserPreferences = require("./models/patchUserPreferences");
const fetchClothByClothesId = require("./models/fetchClothByClothesId");
const fetchFavourties = require("./models/fetchFavourties");

function getClothes(req, res, next) {
  fetchClothes()
    .then((clothes) => {
      res.status(200).send({ clothes });
    })
    .catch(next);
}

function getClothByClothesId(req, res, next) {
  const { clothes_id } = req.params;

  fetchClothByClothesId(clothes_id)
    .then((item) => {
      res.status(200).send({ item });
    })
    .catch(next);
}

function getUserByUserId(req, res, next) {
  const { user_id } = req.params;

  fetchUserByUserId(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function patchUserPreferencesByUserId(req, res, next) {
  const { user_id } = req.params;
  const { preferences } = req.body;

  patchUserPreferences(user_id, preferences)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function getSuggestedClothes(req, res, next) {
  const { user_id } = req.params;

  fetchSuggestedClothes(user_id)
    .then((suggestedClothes) => {
      res.status(200).send({ suggestedClothes });
    })
    .catch(next);
}

function getFavouritesByUserId(req, res, next) {
  const { user_id } = req.params;

  fetchFavourties(user_id)
    .then((favourites) => {
      res.status(200).send({ favourites });
    })
    .catch(next);
}

module.exports = {
  getClothes,
  getSuggestedClothes,
  getUserByUserId,
  patchUserPreferencesByUserId,
  getClothByClothesId,
  getFavouritesByUserId,
};
