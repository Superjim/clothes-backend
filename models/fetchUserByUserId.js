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

module.exports = fetchUserByUserId;
