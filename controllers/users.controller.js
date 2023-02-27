const { fetchUserByUserId, patchUserPreferences, addNewUser } = require("../models/user.models");

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

function postNewUser(req, res, next) {
  const newUser = req.body;
  addNewUser(newUser).then((user) => {
    res.status(201).send({ user });
  })
    .catch(next);
}

module.exports = {
    getUserByUserId,
    patchUserPreferencesByUserId,
    postNewUser
}