const db = require("../db/connection");

async function fetchClothes() {
  const clothes = await db.query(`SELECT * FROM clothes;`);

  return clothes.rows;
}

module.exports = fetchClothes;
