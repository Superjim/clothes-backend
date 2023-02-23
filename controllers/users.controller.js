const { fetchUserByUserId, patchUserPreferences } = require("../models/user.models");

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

module.exports = {
    getUserByUserId,
    patchUserPreferencesByUserId,
}