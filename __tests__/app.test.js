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
          expect(clothesArray[i]).toHaveProperty("gender", expect.any(String));
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
        expect(response.body.msg).toBe("Invalid request: Missing preferences");
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
          expect(suggestedArr[i]).toHaveProperty("gender", expect.any(String));
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

describe("GET /API/FAVOURITES/:USER_ID", () => {
  test("200: api point exists and responds", () => {
    return request(app).get("/api/favourites/12342341").expect(200);
  });

  test("200: returns back an object and has a property called userFavouriteClothes", () => {
    return request(app)
      .get("/api/favourites/12342341")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("userFavouriteClothes");
        expect(body.userFavouriteClothes).toBeInstanceOf(Array);
      });
  });

  test("200: Get all favourite clothes given a user id", () => {
    return request(app)
      .get("/api/favourites/12342341")
      .expect(200)
      .then(({ body }) => {
        const favouriteClothes = body.userFavouriteClothes;

        expect(favouriteClothes.length).toBe(5);

        favouriteClothes.forEach((favouriteCloth) => {
          expect(favouriteCloth).toBeInstanceOf(Object);
          expect(favouriteCloth).toHaveProperty(
            "clothes_id",
            expect.any(Number)
          );
          expect(favouriteCloth).toHaveProperty("title", expect.any(String));
          expect(favouriteCloth).toHaveProperty("price", expect.any(String));
          expect(favouriteCloth).toHaveProperty("color", expect.any(String));
          expect(favouriteCloth).toHaveProperty("category", expect.any(String));
          expect(favouriteCloth).toHaveProperty("brand", expect.any(String));
          expect(favouriteCloth).toHaveProperty("gender", expect.any(String));
          expect(favouriteCloth).toHaveProperty(
            "item_img_url",
            expect.any(String)
          );
          expect(favouriteCloth).toHaveProperty("favourite_id", expect.any(Number));
        });
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
        expect(response.body.userFavouriteClothes).toEqual([]);
      });
  });
});

describe("POST /API/FAVOURITES/:USER_ID ", () => {
  test("201: api point exists and returns", () => {
    return request(app)
      .post("/api/favourites/12342341")
      .send({
        clothes_id: 1,
      })
      .expect(201);
  });

  test("201: returns back an object which has a property called favourite", () => {
    return request(app)
      .post("/api/favourites/12342341")
      .send({
        clothes_id: 1,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("favourite");
        expect(body.favourite).toBeInstanceOf(Object);
      });
  });

  test("201: returns back a favourite object with uid and clothes_id keys", () => {
    return request(app)
      .post("/api/favourites/12342341")
      .expect(201)
      .send({
        clothes_id: 1,
      })
      .then(({ body }) => {
        const favourite = body.favourite;

        expect(favourite).toHaveProperty("uid", expect.any(String));
        expect(favourite).toHaveProperty("clothes_id", expect.any(Number));
      });
  });

  test("201: returns back created favourite", () => {
    return request(app)
      .post("/api/favourites/12342341")
      .expect(201)
      .send({
        clothes_id: 1,
      })
      .then(({ body }) => {
        const favourite = body.favourite;

        expect(favourite.uid).toBe("12342341");
        expect(favourite.clothes_id).toBe(1);
      });
  });

  test("400: returns back bad request", () => {
    return request(app)
      .post("/api/favourites/12342341")
      .expect(400)
      .send()
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });

  test("400: returns back bad request when clothes_id has a String type", () => {
    return request(app)
      .post("/api/favourites/12342341")
      .expect(400)
      .send({
        clothes_id: "1",
      })
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Favourite clothes_id 1 should have a number type"
        );
      });
  });

  test("404: returns back a bad request if user is absent in DB", () => {
    return request(app)
      .post("/api/favourites/123423415")
      .expect(404)
      .send({
        clothes_id: 1,
      })
      .then(({ body }) => {
        expect(body.msg).toBe('User ID "123423415" not found');
      });
  });

  test("404: returns back a bad request if user is absent in DB", () => {
    return request(app)
      .post("/api/favourites/12342341")
      .expect(404)
      .send({
        clothes_id: 122222,
      })
      .then(({ body }) => {
        expect(body.msg).toBe('Item ID "122222" not found');
      });
  });
});

describe('DELETE /API/FAVOURITES/:FAVOURITE_ID', () => { 
  test('204: api point exists and returns', () => { 
    return request(app)
      .delete("/api/favourites/1")
      .expect(204);
  })
  test('204: response should be empty', () => {
      return request(app)
        .delete("/api/favourites/1")
        .then(({ body }) => {
          expect(body).toEqual({});
        });
  });
  test('404: returns back an error when Favourite does not exist in DB', () => { 
    return request(app)
      .delete("/api/favourites/2000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Favourite with id 2000 does not exist in DB");
      });
  })
  test('404: returns back an error Invalid input when Favourite ID does not exist', () => {
      return request(app)
        .delete("/api/favourites/notAnId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("You passed notAnId. Favourite id should be a number.");
        });
  });
})

describe('GET /API/BASKETS/:USER_ID', () => {
  test("200: api point exists and responds", () => {
    return request(app).get("/api/baskets/12342341").expect(200);
  });
  test("200: returns back an object and has a property called userBasket", () => {
    return request(app)
      .get("/api/baskets/12342341")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("userBasket");
        expect(body.userBasket).toBeInstanceOf(Array);
      });
  });
  test("200: Get basket with all clothes chosen by user", () => {
    return request(app)
      .get("/api/baskets/12342341")
      .expect(200)
      .then(({ body }) => {
        const userClothesBasket = body.userBasket;

        expect(userClothesBasket.length).toBe(5);

        userClothesBasket.forEach((clothes) => {
          expect(clothes).toBeInstanceOf(Object);
          expect(clothes).toHaveProperty(
            "clothes_id",
            expect.any(Number)
          );
          expect(clothes).toHaveProperty("title", expect.any(String));
          expect(clothes).toHaveProperty("price", expect.any(String));
          expect(clothes).toHaveProperty("color", expect.any(String));
          expect(clothes).toHaveProperty("category", expect.any(String));
          expect(clothes).toHaveProperty("brand", expect.any(String));
          expect(clothes).toHaveProperty("gender", expect.any(String));
          expect(clothes).toHaveProperty(
            "item_img_url",
            expect.any(String)
          );
          expect(clothes).toHaveProperty("basket_count", expect.any(Number));
          expect(clothes).toHaveProperty("basket_id", expect.any(Number));
        });
      });
  });
  test("404: User id not found", () => {
    return request(app)
      .get("/api/baskets/1000000000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual('User ID "1000000000" not found');
      });
  });
  test("200: User with empty basket responds with empty array", () => {
    return request(app)
      .get("/api/baskets/32342341")
      .expect(200)
      .then((response) => {
        expect(response.body.userBasket).toEqual([]);
      });
  });
});

describe("POST /API/BASKETS/:USER_ID ", () => {
  test("201: api point exists and returns", () => {
    return request(app)
      .post("/api/baskets/12342341")
      .send({
        clothes_id: 6,
      })
      .expect(201);
  });
  test("201: returns back an object which has a property called basket", () => {
    return request(app)
      .post("/api/baskets/12342341")
      .send({
        clothes_id: 1,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("clothesBasket");
        expect(body.clothesBasket).toBeInstanceOf(Object);
      });
  });
  test("201: returns back a clothesBasket object with basket_count, uid and clothes_id keys", () => {
    return request(app)
      .post("/api/baskets/12342341")
      .expect(201)
      .send({
        clothes_id: 1,
      })
      .then(({ body }) => {
        const clothesBasket = body.clothesBasket;

        expect(clothesBasket).toHaveProperty("basket_id", expect.any(Number));
        expect(clothesBasket).toHaveProperty("uid", expect.any(String));
        expect(clothesBasket).toHaveProperty("clothes_id", expect.any(Number));
      });
  });
  test("201: returns back created basket", () => {
    return request(app)
      .post("/api/baskets/12342341")
      .expect(201)
      .send({
        clothes_id: 6,
      })
      .then(({ body }) => {
        const clothesBasket = body.clothesBasket;

        expect(clothesBasket.basket_count).toBe(1);
        expect(clothesBasket.uid).toBe("12342341");
        expect(clothesBasket.clothes_id).toBe(6);
      });
  });
  test("400: returns back bad request", () => {
    return request(app)
      .post("/api/baskets/12342341")
      .expect(400)
      .send()
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("400: returns back bad request when clothes_id has a String type", () => {
    return request(app)
      .post("/api/baskets/12342341")
      .expect(400)
      .send({
        clothes_id: "1",
      })
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Basket clothes_id 1 should have a number type"
        );
      });
  });
  test("404: returns back a bad request if user is absent in DB", () => {
    return request(app)
      .post("/api/baskets/123423415")
      .expect(404)
      .send({
        clothes_id: 1,
      })
      .then(({ body }) => {
        expect(body.msg).toBe('User ID "123423415" not found');
      });
  });
  test("404: returns back a bad request if user is absent in DB", () => {
    return request(app)
      .post("/api/baskets/12342341")
      .expect(404)
      .send({
        clothes_id: 122222,
      })
      .then(({ body }) => {
        expect(body.msg).toBe('Item ID "122222" not found');
      });
  });
});