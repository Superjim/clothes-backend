const db = require("../db/connection");
const { fetchUserByUserId } = require("./user.models");

async function fetchUserBasket(user_id) {
  await fetchUserByUserId(user_id);

  try {
    const selectUserBasket = `
      SELECT c.*, b.basket_id, b.basket_count 
      FROM clothes c 
      INNER JOIN baskets b 
      ON c.clothes_id = b.clothes_id 
      WHERE b.uid = $1;
    `;

    const { rows: userBasket } = await db.query(
      selectUserBasket, 
      [user_id]
    );

    console.log(userBasket);
    return userBasket;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  fetchUserBasket,
}