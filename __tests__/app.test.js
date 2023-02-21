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
    test("responds with an array of clothes objects", () => {
      return request(app).get("/api/clothes").expect(200);
    });
  });
});
