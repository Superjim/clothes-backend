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
  
    const sqlPatchQuery = `UPDATE users SET preferences = $1 WHERE uid = $2`;
  
    try {
      await db.query(sqlPatchQuery, [preferences, user_id]);
  
      return "User preferences updated";
    } catch (error) {
      throw { status: 500, msg: error.message };
    }
  }

module.exports = {
    fetchUserByUserId,
    patchUserPreferences
};