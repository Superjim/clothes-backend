const format = require("pg-format");
const db = require("../connection");

const seed = ({ itemData, userData, favouritesData, recentData, basketData }) => {
  return db
    .query(`DROP TABLE IF EXISTS favourites cascade;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS baskets cascade;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS recent_items cascade;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS clothes;`);
    })
    .then(() => {
      const clothesTablePromise = db.query(
        `
        CREATE TABLE clothes (
            clothes_id SERIAL PRIMARY KEY,
            title VARCHAR NOT NULL,
            price MONEY NOT NULL,
            color VARCHAR NOT NULL,
            category VARCHAR NOT NULL,
            brand VARCHAR NOT NULL,
            gender VARCHAR NOT NULL,
            item_img_url VARCHAR NOT NULL
        );
        `
      );

      const usersTablePromise = db.query(
        `
            CREATE TABLE users (
                uid VARCHAR PRIMARY KEY NOT NULL,
                username VARCHAR NOT NULL,
                firstname VARCHAR NOT NULL,
                preferences VARCHAR NOT NULL
            );
            `
      );

      return Promise.all([clothesTablePromise, usersTablePromise]);
    })
    .then(() => {
      const favouritesTable = db.query(
        `
        CREATE TABLE favourites (
          favourite_id SERIAL PRIMARY KEY,
          clothes_id INT NOT NULL REFERENCES clothes(clothes_id),
          uid VARCHAR NOT NULL REFERENCES users(uid)
        );
        `
      );

      return favouritesTable;
    })
    .then(() => {
      const basketTable = db.query(
        `
        CREATE TABLE baskets (
          basket_id SERIAL PRIMARY KEY,
          basket_count INT DEFAULT 1,
          clothes_id INT NOT NULL REFERENCES clothes(clothes_id),
          uid VARCHAR NOT NULL REFERENCES users(uid)
        );
        `
      );

      return basketTable;
    })
    .then(() => {
      const recent_items = db.query(
        `
        CREATE TABLE recent_items (
          recent_id SERIAL PRIMARY KEY,
          clothes_id INT NOT NULL REFERENCES clothes(clothes_id),
          uid VARCHAR NOT NULL REFERENCES users(uid),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        `
      );

      return recent_items;
    })
    .then(() => {
      const insertClothesData = format(
        `
        INSERT INTO clothes (title, price, color, category, brand, gender, item_img_url)
         VALUES %L RETURNING *;
        `,
        itemData.map(
          ({ title, price, color, category, brand, gender, item_img_url }) => [
            title,
            price,
            color,
            category,
            brand,
            gender,
            item_img_url,
          ]
        )
      );

      return db.query(insertClothesData);
    })
    .then(() => {
      const insertUsersData = format(
        `
        INSERT INTO users (uid, username, firstname, preferences) 
        VALUES %L RETURNING *;
        `,
        userData.map(({ uid, username, firstname, preferences }) => [
          uid,
          username,
          firstname,
          preferences,
        ])
      );

      return db.query(insertUsersData);
    })
    .then(() => {
      const insertFavouritesData = format(
        `
        INSERT INTO favourites (uid, clothes_id) 
        VALUES %L RETURNING *;
        `,
        favouritesData.map(({ uid, clothes_id }) => [uid, clothes_id])
      );

      return db.query(insertFavouritesData);
    })
    .then(() => {
      const insertRecentData = format(
        `
        INSERT INTO recent_items (uid, clothes_id) 
        VALUES %L RETURNING *;
        `,
        recentData.map(({ uid, clothes_id }) => [uid, clothes_id])
      );

      return db.query(insertRecentData);
    })
    .then(() => {
      const insertBasketData = format(
        `
        INSERT INTO baskets (basket_count, uid, clothes_id) 
        VALUES %L RETURNING *;
        `,
        basketData.map(({ basket_count, uid, clothes_id }) => [basket_count, uid, clothes_id])
      );

      return db.query(insertBasketData);
    });
};

module.exports = seed;
