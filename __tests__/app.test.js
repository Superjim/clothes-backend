const testData = require("../db/data/testData/index");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) {
    db.end();
  }
});

describe("clothes-backend", () => {
  describe("GET /api/clothes", () => {
    test("responds with status 200", () => {
      return request(app).get("/api/clothes").expect(200);
    });
    test("responds with an array of clothes objects", () => {
      return request(app)
        .get("/api/clothes")
        .expect(200)
        .then((response) => {
          const clothesArray = response.body.clothes;
          expect(clothesArray).toBeInstanceOf(Array);
          for (let i = 0; i < clothesArray.length; i++) {
            expect(clothesArray[i]).toHaveProperty(
              "clothes_id",
              expect.any(Number)
            );
            expect(clothesArray[i]).toHaveProperty("title", expect.any(String));
            expect(clothesArray[i]).toHaveProperty("price", expect.any(String));
            expect(clothesArray[i]).toHaveProperty("color", expect.any(String));
            expect(clothesArray[i]).toHaveProperty(
              "category",
              expect.any(String)
            );
            expect(clothesArray[i]).toHaveProperty("brand", expect.any(String));
            expect(clothesArray[i]).toHaveProperty(
              "gender",
              expect.any(String)
            );
            expect(clothesArray[i]).toHaveProperty(
              "item_img_url",
              expect.any(String)
            );
          }
        });
    });
  });
  describe("GET /api/clothes/:clothes_id", () => {
    test("test returns single clothes object with relevent properties and status 200", () => {
      return request(app)
        .get("/api/clothes/276")
        .expect(200)
        .then((response) => {
          const singleItem = response.body.item;
          expect(singleItem).toHaveProperty("clothes_id", 276);
          expect(singleItem).toHaveProperty("title", expect.any(String));
          expect(singleItem).toHaveProperty("price", expect.any(String));
          expect(singleItem).toHaveProperty("color", expect.any(String));
          expect(singleItem).toHaveProperty("category", expect.any(String));
          expect(singleItem).toHaveProperty("brand", expect.any(String));
          expect(singleItem).toHaveProperty("gender", expect.any(String));
          expect(singleItem).toHaveProperty("item_img_url", expect.any(String));
        });
    });
    test("invalid clothes id should return 404 Item not found", () => {
      return request(app)
        .get("/api/clothes/1000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual('Item ID "1000" not found');
        });
    });
    test("invalid request returns 400 ", () => {
      return request(app)
        .get("/api/clothes/cheese")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
  });
  describe("fetchUserByUserId", () => {
    test("returns an existing user", () => {
      return request(app)
        .get("/api/users/12342341")
        .expect(200)
        .then((response) => {
          const user = response.body.user;
          expect(user).toHaveProperty("uid", "12342341");
          expect(user).toHaveProperty("username", "superjim");
          expect(user).toHaveProperty("firstname", "Jim");
          expect(user).toHaveProperty("preferences", "blue black white white");
        });
    });

    test("throws error if user doesnt exist", () => {
      return request(app)
        .get("/api/users/cheese")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual('User ID "cheese" not found');
        });
    });
  });

  describe("patchUserPreferencesByUserId", () => {
    test("updates user preferences", () => {
      return request(app)
        .patch("/api/users/12342341/preferences")
        .send({ preferences: "trendy shirt with fire print" })
        .expect(200)
        .then((response) => {
          expect(response.body.user).toEqual({
            firstname: "Jim",
            preferences: "trendy shirt with fire print",
            uid: "12342341",
            username: "superjim",
          });
        });
    });

    test("400 bad request if preferences is not a string", () => {
      return request(app)
        .patch("/api/users/12342341/preferences")
        .send({ preferences: 123 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: preferences is not a string"
          );
        });
    });

    test("400 bad request if preferences string length is less than 4", () => {
      return request(app)
        .patch("/api/users/12342341/preferences")
        .send({ preferences: "abc" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid preferences: String length must be greater than 3"
          );
        });
    });

    test("400 bad request if request body is missing preferences field", () => {
      return request(app)
        .patch("/api/users/12342341/preferences")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: Missing preferences"
          );
        });
    });

    test("throw err if user doesnt exist", () => {
      return request(app)
        .patch("/api/users/cheese/preferences")
        .send({ preferences: "red green blue yellow" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual('User ID "cheese" not found');
        });
    });
  });

  describe("error handling", () => {
    test("/api/helloworld path does not exist", () => {
      return request(app)
        .get("/api/helloworld")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Path not found");
        });
    });
  });

  describe("GET /api/users/:user_id/suggested_clothes", () => {
    test("200: Respond with an array of 10 suggested clothes objects", () => {
      return request(app)
        .get("/api/users/12342341/suggested_clothes")
        .expect(200)
        .then(({ body }) => {
          const suggestedArr = body.suggestedClothes;

          expect(suggestedArr.length).toEqual(10);

          for (let i = 0; i < suggestedArr.length; i++) {
            expect(typeof suggestedArr[i]).toBe("object");
            expect(Array.isArray(suggestedArr[i])).toBe(false);
            expect(suggestedArr[i]).toHaveProperty(
              "clothes_id",
              expect.any(Number)
            );
            expect(suggestedArr[i]).toHaveProperty("title", expect.any(String));
            expect(suggestedArr[i]).toHaveProperty("price", expect.any(String));
            expect(suggestedArr[i]).toHaveProperty("color", expect.any(String));
            expect(suggestedArr[i]).toHaveProperty(
              "category",
              expect.any(String)
            );
            expect(suggestedArr[i]).toHaveProperty("brand", expect.any(String));
            expect(suggestedArr[i]).toHaveProperty(
              "gender",
              expect.any(String)
            );
            expect(suggestedArr[i]).toHaveProperty(
              "item_img_url",
              expect.any(String)
            );
          }
        });
    });

    test("404: Not Found when uid is not in db", () => {
      return request(app)
        .get("/api/users/12456641/suggested_clothes")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('User ID "12456641" not found');
        });
    });

    test("excludes recent items", () => {
      return request(app)
        .get("/api/users/12342341/suggested_clothes")
        .expect(200)
        .then(({ body }) => {
          const suggestedArr = body.suggestedClothes;

          for (let i = 0; i < suggestedArr.length; i++) {
            expect(suggestedArr[i].clothes_id).not.toBeLessThanOrEqual(40);
          }
        });
    });
  });

  describe("GET /api/favourites/:user_id", () => {
    test("200: Get all favourites given a user id", () => {
      return request(app)
        .get("/api/favourites/12342341")
        .expect(200)
        .then((response) => {
          const favouritesArr = response.body.favourites;

          expect(favouritesArr.length).toBe(5);

          for (let i = 0; i < favouritesArr.length; i++) {
            expect(typeof favouritesArr[i]).toBe("object");
            expect(Array.isArray(favouritesArr[i])).toBe(false);
            expect(favouritesArr[i]).toHaveProperty(
              "favourite_id",
              expect.any(Number)
            );
            expect(favouritesArr[i]).toHaveProperty("uid", expect.any(String));
            expect(favouritesArr[i]).toHaveProperty(
              "clothes_id",
              expect.any(Number)
            );
          }
        });
    });

    test("404: User id not found", () => {
      return request(app)
        .get("/api/favourites/1000000000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual('User ID "1000000000" not found');
        });
    });

    test("200: User with no favourites responds with empty array", () => {
      return request(app)
        .get("/api/favourites/32342341")
        .expect(200)
        .then((response) => {
          expect(response.body.favourites).toEqual([]);
        });
    });
  });
});
