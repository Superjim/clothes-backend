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

  //cut the array size down to 200 and get 10 most relevent
  const selectedClothes = clothes.slice(0, 200);

  const cosineSimilarityList = suggestionAlgorithmFunc(selectedClothes, user);
  const suggestedClothes = [];

  cosineSimilarityList.forEach((suggetedItem) => {
    const item = clothes.filter((item) => item.clothes_id === suggetedItem.id);

    suggestedClothes.push(...item);
  });

  // add suggestedClothes to recent items table
  const sqlAddRecentItemsQuery = `INSERT INTO recent_items (uid, clothes_id) VALUES ($1, $2)`;
  const insertPromises = suggestedClothes.map((item) => {
    return db.query(sqlAddRecentItemsQuery, [user_id, item.clothes_id]);
  });
  await Promise.all(insertPromises);

  if (suggestedClothes.length === 10) {
    return suggestedClothes;
  } else {
    return [
      {
        clothes_id: 293,
        title: "adidas Originals adicolor Next Colorado sweatpants in black",
        price: "£65.00",
        color: "Black",
        category: "joggers",
        brand: "adidas Originals",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/adidas-originals-adicolor-next-colorado-sweatpants-in-black/203895258-1-black",
      },
      {
        clothes_id: 773,
        title: "adidas Originals adicolor Next Colorado sweatpants in black",
        price: "£65.00",
        color: "Black",
        category: "tracksuits",
        brand: "adidas Originals",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/adidas-originals-adicolor-next-colorado-sweatpants-in-black/203895258-1-black",
      },
      {
        clothes_id: 633,
        title: "ASOS DESIGN sliders in red",
        price: "£23.00",
        color: "RED",
        category: "shoes",
        brand: "ASOS DESIGN",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/asos-design-sliders-in-red/203986149-1-red",
      },
      {
        clothes_id: 303,
        title: "adidas Originals Tall New C sweatpants in black",
        price: "£70.00",
        color: "Black",
        category: "joggers",
        brand: "adidas Originals",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/adidas-originals-tall-new-c-sweatpants-in-black/203885956-1-black",
      },
      {
        clothes_id: 160,
        title: "adidas Originals adicolor Next Colorado hoodie in black",
        price: "£70.00",
        color: "Black",
        category: "hoodies",
        brand: "adidas Originals",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/adidas-originals-adicolor-next-colorado-hoodie-in-black/203894713-1-black",
      },
      {
        clothes_id: 656,
        title: "adidas Originals Forum 84 mid sneakers in black",
        price: "£120.00",
        color: "Black",
        category: "shoes",
        brand: "adidas Originals",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/adidas-originals-forum-84-mid-sneakers-in-black/203888492-1-black",
      },
      {
        clothes_id: 772,
        title: "adidas Originals Essentials+ fluffy joggers in off-white",
        price: "£75.00",
        color: "CREAM",
        category: "tracksuits",
        brand: "adidas Originals",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/adidas-originals-essentials-fluffy-joggers-in-off-white/203894658-1-cream",
      },
      {
        clothes_id: 290,
        title: "adidas Originals tall 3-Stripes sweatpants in blue",
        price: "£65.00",
        color: "MID BLUE",
        category: "joggers",
        brand: "adidas Originals",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/adidas-originals-tall-3-stripes-sweatpants-in-blue/203885915-1-midblue",
      },
      {
        clothes_id: 182,
        title:
          "adidas Originals 'Preppy Varsity' large logo sweatshirt in beige",
        price: "£60.00",
        color: "BEIGE",
        category: "hoodies",
        brand: "adidas Originals",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/adidas-originals-preppy-varsity-large-logo-sweatshirt-in-beige/203732702-1-beige",
      },
      {
        clothes_id: 508,
        title: "Farah Brewer cotton slim fit shirt in green",
        price: "£112.00",
        color: "Green",
        category: "shirts",
        brand: "Farah",
        gender: "male",
        item_img_url:
          "images.asos-media.com/products/farah-brewer-cotton-slim-fit-shirt-in-green/203511012-1-green",
      },
    ];
  }
}

module.exports = {
  fetchClothes,
  fetchClothByClothesId,
  fetchSuggestedClothes,
};
