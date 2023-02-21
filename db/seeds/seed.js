const format = require("pg-format");
const db = require("../connection");

const seed = () => {
  return db
    .query(`DROP TABLE IF EXISTS favourites;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS basket;`);
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
            style VARCHAR NOT NULL,
            material VARCHAR NOT NULL,
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
    });
};

module.exports = seed;