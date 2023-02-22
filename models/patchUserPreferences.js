const db = require("../db/connection");
const fetchUserByUserId = require("./fetchUserByUserId");

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

module.exports = patchUserPreferences;
