const db = require("../db/connection");
const { fetchUserByUserId } = require("./user.models");
const { fetchClothByClothesId } = require("./clothes.models");

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

    return userBasket;
  } catch (error) {
    throw error;
  }
}

async function addClothesToBasket(user_id, newClothes) {
  try {
    if (!newClothes.clothes_id) {
      throw {
        status: 400,
        msg: "Bad request!",
      };
    }
    if (typeof newClothes.clothes_id !== "number") {
      throw {
        status: 400,
        msg: `Basket clothes_id ${newClothes.clothes_id} should have a number type`,
      };
    }

    await fetchUserByUserId(user_id);
    await fetchClothByClothesId(newClothes.clothes_id);

    const clothesBasketData = [newClothes.clothes_id, user_id];

    const insertClothesToBasket = `
            INSERT INTO baskets 
            (clothes_id, uid) 
            VALUES ($1, $2) RETURNING *;
        `;

    const {
      rows: [clothesBasket],
    } = await db.query(insertClothesToBasket, clothesBasketData);

    return clothesBasket;
  } catch (error) {
    throw error;
  }
}

async function removeBasket(basket_id) {
  try {
    if (!parseInt(basket_id)) {
      throw { 
          status: 400,
          msg: `You passed ${basket_id}. Basket id should be a number.` 
        };
    }

    const deleteBasket = `
      DELETE FROM baskets 
      WHERE basket_id = $1 
      RETURNING *;
    `;

    const {
      rowCount
    } = await db.query(deleteBasket, [basket_id]);

    if (rowCount === 0) {
      throw {
        status: 404,
        msg: `Basket with id ${basket_id} does not exist in DB`,
      };
    }

    return;
  } catch (error) {
      throw error;
  }
}

async function updateCountOfClothesInBasket(basket_id, basketBody) {
  try {
    if (!parseInt(basket_id)) {
      throw { 
        status: 400,
        msg: `You passed ${basket_id}. Basket id should be a number.` };
    }
  
    if (!basketBody.clothes_count) {
        throw {
          status: 400,
          msg: "Bad request!",
        };
    }
  
    if (typeof basketBody.clothes_count !== "number") {
        throw {
            status: 400,
            msg: `clothes_count ${basketBody.clothes_count} property should have a number type`
        };
    }
  
    const setNewCount = `
        UPDATE baskets 
        SET basket_count = basket_count + $1 
        WHERE basket_id = $2 
        RETURNING *;
    `;
  
    const {
      rowCount,
      rows: [basket],
    } = await db.query(setNewCount, [basketBody.clothes_count, basket_id]);
  
    if (rowCount === 0) {
      throw {
        status: 404,
        msg: `Basket with id ${basket_id} does not exist in DB`,
      };
    }
    
    return basket;
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  fetchUserBasket,
  addClothesToBasket,
  removeBasket,
  updateCountOfClothesInBasket,
}