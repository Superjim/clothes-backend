const db = require("../db/connection");
const { fetchUserByUserId } = require("./user.models");
const { fetchClothByClothesId } = require("./clothes.models");

async function fetchFavourites(user_id) {
    await fetchUserByUserId(user_id);
    
	const sqlString = `SELECT * FROM favourites WHERE uid = $1`;

	const { rows: favourites } = await db.query(sqlString, [user_id]);

	return favourites;
}

async function addFavourite(user_id, newFavourite) {
    try {
        console.log(user_id);
        console.log(newFavourite.clothes_id);
        
        if (!newFavourite.clothes_id) {
            throw { 
                status: 400, 
                msg: "Bad request!" 
            };
        }
        if(typeof newFavourite.clothes_id !== "number") {
            return Promise.reject({
                status: 400,
                msg: `Favourite clothes_id ${newFavourite.clothes_id} should have a number type`,
            })
        }

        await fetchUserByUserId(user_id);
        await fetchClothByClothesId(newFavourite.clothes_id);    

        const favouriteData = [
            newFavourite.clothes_id,
            user_id,
        ];  

        const insertUserFavourite = `
            INSERT INTO favourites 
            (clothes_id, uid) 
            VALUES ($1, $2) RETURNING *;
        `;

        const {
            rows: [favourite],
          } = await db.query(insertUserFavourite, favouriteData);

        return favourite;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    fetchFavourites,
    addFavourite,
};