const cors = require("cors");
const { response } = require("express");
const express = require("express");
const app = express();
app.use(cors());


const { getClothes, getClothByClothesId, getSuggestedClothes } = require("./controllers/clothes.controller");
const { getUserByUserId, patchUserPreferencesByUserId } = require("./controllers/users.controller");
const { getFavouritesByUserId } = require("./controllers/favourites.controller");

app.use(express.json());

app.get("/api/clothes", getClothes);
app.get("/api/clothes/:clothes_id", getClothByClothesId);
app.get("/api/users/:user_id", getUserByUserId);
app.get("/api/favourites/:user_id", getFavouritesByUserId);
app.patch("/api/users/:user_id/preferences", patchUserPreferencesByUserId);
app.get("/api/users/:user_id/suggested_clothes", getSuggestedClothes);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

// POSTGRES ERROR
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" }); // INVALID TEXT REPRESENTATION
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" }); // NOT NULL VIOLATION
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" }); // FORIEGN KEY VIOLATION
  } else {
    next(err);
  }
});

//CUSTOM ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
