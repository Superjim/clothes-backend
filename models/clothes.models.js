const db = require("../db/connection");
const { suggestionAlgorithmFunc } = require("../utils/algorithm");
const { fetchUserByUserId } = require("./user.models");

async function fetchClothes() {
  const clothes = await db.query(`SELECT * FROM clothes;`);

  return clothes.rows;
}

async function fetchClothByClothesId(clothes_id) {
  const sqlString = `SELECT * FROM clothes WHERE clothes.clothes_id = $1`;
  try {
    const {
      rows: [item],
    } = await db.query(sqlString, [clothes_id]);

    if (!item) {
      throw { status: 404, msg: `Item ID "${clothes_id}" not found` };
    }

    return item;
  } catch (error) {
    // console.log(error);
    throw error;
  }
}

async function fetchSuggestedClothes(user_id) {
  const user = await fetchUserByUserId(user_id);

  //more items = more time and it doesnt look linear past 2/300 items
  //when `SELECT * FROM clothes LIMIT x;`
  // 100 = 147ms
  // 200 = 323ms
  // 300 = 546ms
  // 400 = 847ms
  // 500 = 1228ms
  // 600 = 1638ms
  // 700 = 2158ms
  // 800 = 2743ms
  // although it doesnt take long to select all the clothes (816 as of 22feb) from the database
  // with that in mind:

  //get all the clothes
  const sqlClothesQuery = `SELECT * FROM clothes;`;
  let { rows: clothes } = await db.query(sqlClothesQuery);

  //get the users recent items, ordered by the time they were added
  const sqlRecentItemsQuery = `SELECT clothes_id FROM recent_items WHERE uid = $1 ORDER BY created_at DESC LIMIT 100;`;
  const { rows: recentItems } = await db.query(sqlRecentItemsQuery, [user_id]);

  //array of recent item ids
  const recentItemsIds = recentItems.map((item) => item.clothes_id);

  //filter cloths to exclude the recent items
  clothes = clothes.filter((item) => !recentItemsIds.includes(item.clothes_id));

  //shuffle the clothes, this could work nicely because we want the randomness factor
  for (let i = clothes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clothes[i], clothes[j]] = [clothes[j], clothes[i]];
  }

  //cut the array size down to 100 and get 10 most relevent
  const selectedClothes = clothes.slice(0, 200);

  const cosineSimilarityList = suggestionAlgorithmFunc(selectedClothes, user);
  const suggestedClothes = [];

  cosineSimilarityList.forEach((suggetedItem) => {
    const item = clothes.filter((item) => item.clothes_id === suggetedItem.id);

    suggestedClothes.push(...item);
  });

  // add suggestedClothes to recent items table
  const sqlAddRecentItemsQuery = `INSERT INTO recent_items (uid, clothes_id) VALUES ($1, $2)`;
  for (const item of suggestedClothes) {
    await db.query(sqlAddRecentItemsQuery, [user_id, item.clothes_id]);
  }

  return suggestedClothes;
}

module.exports = {
  fetchClothes,
  fetchClothByClothesId,
  fetchSuggestedClothes,
};
