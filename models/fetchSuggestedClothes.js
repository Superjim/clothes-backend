const db = require("../db/connection");
const { suggestionAlgorithmFunc } = require("../utils/algorithm");

function fetchSuggestedClothes(user_id) {
  const sqlClothesQuery = `SELECT * FROM clothes;`;
  const sqlUserQuery = `SELECT * FROM users WHERE users.uid = $1;`;

  const clothesPromise = db.query(sqlClothesQuery);
  const userPromise = db.query(sqlUserQuery, [user_id]);

  return Promise.all([clothesPromise, userPromise]).then(
    ([
      { rows: clothes },
      {
        rows: [user],
      },
    ]) => {
      if (user) {
        const cosineSimilarityList = suggestionAlgorithmFunc(clothes, user);
        const suggestedClothes = [];

        cosineSimilarityList.forEach((suggetedItem) => {
          const item = clothes.filter(
            (item) => item.clothes_id === suggetedItem.id
          );

          suggestedClothes.push(...item);
        });

        return suggestedClothes;
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    }
  );
}

module.exports = fetchSuggestedClothes;
