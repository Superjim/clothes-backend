const format = require("pg-format");
const db = require("../connection");

const seed = ({ itemData, userData }) => {
  return db
    .query(`DROP TABLE IF EXISTS favourites cascade;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS baskets cascade;`);
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
                uid VARCHAR PRIMARY KEY,
                username VARCHAR NOT NULL,
                firstname VARCHAR NOT NULL,
                preferences VARCHAR
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
          clothes_id INT NOT NULL REFERENCES clothes(clothes_id),
          uid VARCHAR NOT NULL REFERENCES users(uid)
        );
        `
      );

      return basketTable;
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
    });
};

module.exports = seed;
