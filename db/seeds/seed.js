const format = require("pg-format");
const db = require("../connection");

const seed = ({ itemsData, usersData }) => {
  return db
    .query(`DROP TABLE IF EXISTS favourites`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS basket`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS clothes`);
    })
    .then(() => {
      const clothesTablePromise = db.query(
        `
        CREATE TABLE clothes (
            item_id SERIAL PRIMARY KEY,
            title VARCHAR NOT NULL,
            price MONEY NOT NULL,
            color VARCHAR NOT NULL,
            category VARCHAR NOT NULL,
            style VARCHAR NOT NULL,
            material VARCHAR NOT NULL,
            item_img_url VARCHAR NOT NULL
        )
        `
      );

      const usersTablePromise = db.query(
        `
            CREATE TABLE users (
                uid VARCHAR PRIMARY KEY,
                username VARCHAR NOT NULL,
                firstname VARCHAR NOT NULL,
                preferences VARCHAR
            )
            `
      );

      return Promise.all([clothesTablePromise, usersTablePromise]);
    });
};
