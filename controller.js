const fetchClothes = require("./models/fetchClothes");
const fetchSuggestedClothes = require("./models/fetchSuggestedClothes");
const fetchUserByUserId = require("./models/fetchUserByUserId");
const patchUserPreferences = require("./models/patchUserPreferences");

function getClothes(req, res, next) {
  fetchClothes()
    .then((clothes) => {
      res.status(200).send({ clothes });
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
    .then((msg) => {
      res.status(200).send({ msg });
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

module.exports = {
  getClothes,
  getSuggestedClothes,
  getUserByUserId,
  patchUserPreferencesByUserId,
};
