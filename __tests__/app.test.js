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
            expect(clothesArray[i]).toHaveProperty("style", expect.any(String));
            expect(clothesArray[i]).toHaveProperty(
              "material",
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
});
