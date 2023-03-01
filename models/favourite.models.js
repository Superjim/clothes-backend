const db = require("../db/connection");
const { fetchUserByUserId } = require("./user.models");
const { fetchClothByClothesId } = require("./clothes.models");

async function fetchUserFavouriteClothes(user_id) {
	await fetchUserByUserId(user_id);

	try {
		const selectUserFavouriteClothes = `
        SELECT c.*, f.favourite_id  
        FROM clothes c 
        INNER JOIN favourites f 
        ON c.clothes_id = f.clothes_id 
        WHERE f.uid = $1;
        `;

		const { rows: userFavouriteClothes } = await db.query(selectUserFavouriteClothes, [user_id]);

		return userFavouriteClothes;
	} catch (error) {
		throw error;
	}
}

async function addFavourite(user_id, newFavourite) {
	try {
		if (!newFavourite.clothes_id) {
			throw {
				status: 400,
				msg: "Bad request!",
			};
		}
		if (typeof newFavourite.clothes_id !== "number") {
			throw {
				status: 400,
				msg: `Favourite clothes_id ${newFavourite.clothes_id} should have a number type`,
			};
		}

		await fetchUserByUserId(user_id);
		await fetchClothByClothesId(newFavourite.clothes_id);
		const favouriteClothes = await fetchUserFavouriteClothes(user_id);
		const filterFavourite = favouriteClothes.filter(
			(currFav) => currFav.clothes_id === newFavourite.clothes_id
		);

		if (filterFavourite.length > 0) {
			throw {
				status: 400,
				msg: `Bad request!`,
			};
		}

		const favouriteData = [newFavourite.clothes_id, user_id];

		const insertUserFavourite = `
            INSERT INTO favourites 
            (clothes_id, uid) 
            VALUES ($1, $2) RETURNING *;
        `;

		const {
			rows: [favourite],
		} = await db.query(insertUserFavourite, favouriteData);

		return favourite;
	} catch (error) {
		throw error;
	}
}

async function removeFavourite(favourite_id) {
	try {
		if (!parseInt(favourite_id)) {
			throw {
				status: 400,
				msg: `You passed ${favourite_id}. Favourite id should be a number.`,
			};
		}

		const deleteFavourite = `
      DELETE FROM favourites 
      WHERE favourite_id = $1 
      RETURNING *;
    `;

		const { rowCount } = await db.query(deleteFavourite, [favourite_id]);

		if (rowCount === 0) {
			throw {
				status: 404,
				msg: `Favourite with id ${favourite_id} does not exist in DB`,
			};
		}

		return;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	addFavourite,
	fetchUserFavouriteClothes,
	removeFavourite,
};
