const db = require("../db/connection");

async function fetchUserByUserId(user_id) {
  const sqlUserQuery = `SELECT * FROM users WHERE uid = $1`;

  try {
    const {
      rows: [user],
    } = await db.query(sqlUserQuery, [user_id]);

    if (!user) {
      throw { status: 404, msg: `User ID "${user_id}" not found` };
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function patchUserPreferences(user_id, preferences) {
    //check user exists in database
    await fetchUserByUserId(user_id);

    // check preferences exists
    if (!preferences) {
      throw { status: 400, msg: "Invalid request: Missing preferences" };
    }

    // check preferences is string
    if (typeof preferences !== "string") {
      throw { status: 400, msg: "Invalid request: preferences is not a string" };
    }

    // check preferences string length >= 4
    if (preferences.length < 4) {
      throw {
        status: 400,
        msg: "Invalid preferences: String length must be greater than 3",
      };
    }

    //returns user object
    try {
      const sqlPatchQuery = `UPDATE users SET preferences = $1 WHERE uid = $2 RETURNING *;`;

      const {
        rows: [user],
      } = await db.query(sqlPatchQuery, [preferences, user_id]);

      return user;
    } catch (error) {
      throw { status: 500, msg: error.message };
    }
  }

module.exports = {
    fetchUserByUserId,
    patchUserPreferences
};