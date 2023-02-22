const db = require("../db/connection");

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
    console.log(error);
    throw error;
  }
}

module.exports = fetchClothByClothesId;
