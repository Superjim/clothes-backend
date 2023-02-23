const db = require("../db/connection");
const { fetchUserByUserId } = require("./user.models");


async function fetchFavourites(user_id) {
    await fetchUserByUserId(user_id);
    
	const sqlString = `SELECT * FROM favourites WHERE uid = $1`;

	const { rows: favourites } = await db.query(sqlString, [user_id]);

	return favourites;
}

module.exports = {
    fetchFavourites,
};