const { fetchClothes, fetchSuggestedClothes, fetchClothByClothesId } = require("../models/clothes.models");

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
  getClothByClothesId,
  getSuggestedClothes,
}