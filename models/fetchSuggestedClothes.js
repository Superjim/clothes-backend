const db = require("../db/connection");
const { suggestionAlgorithmFunc } = require("../utils/algorithm");
const fetchUserByUserId = require("./fetchUserByUserId");

async function fetchSuggestedClothes(user_id) {
  const user = await fetchUserByUserId(user_id);

  const sqlClothesQuery = `SELECT * FROM clothes;`;

  const { rows: clothes } = await db.query(sqlClothesQuery);

  const cosineSimilarityList = suggestionAlgorithmFunc(clothes, user);
  const suggestedClothes = [];

  cosineSimilarityList.forEach((suggetedItem) => {
    const item = clothes.filter((item) => item.clothes_id === suggetedItem.id);

    suggestedClothes.push(...item);
  });

  return suggestedClothes;
}

module.exports = fetchSuggestedClothes;
