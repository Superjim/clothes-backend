# clothes-backend

This is a CRUD backend to allow operations for our swipe based react native clothing application.

# Endpoints

## Clothes

| HTTP Method | Endpoint                 | Description                                        |
| ----------- | ------------------------ | -------------------------------------------------- |
| GET         | /api/clothes             | Returns a list of all clothing items               |
| GET         | /api/clothes/:clothes_id | Returns a specific clothing item with the given ID |

## Users

| HTTP Method | Endpoint                              | Description                                                    |
| ----------- | ------------------------------------- | -------------------------------------------------------------- |
| GET         | /api/users/:user_id                   | Returns a specific user with the given ID                      |
| PATCH       | /api/users/:user_id/preferences       | Updates the preferences for a specific user                    |
| POST        | /api/users                            | Creates a new user                                             |
| GET         | /api/users/:user_id/suggested_clothes | Returns a list of suggested clothing items for a specific user |

## Favourites

| HTTP Method | Endpoint                      | Description                                                     |
| ----------- | ----------------------------- | --------------------------------------------------------------- |
| GET         | /api/favourites/:user_id      | Returns a list of favourite clothing items for a specific user  |
| POST        | /api/favourites/:user_id      | Adds a clothing item to the favourites list for a specific user |
| DELETE      | /api/favourites/:favourite_id | Deletes a favourite clothing item for a specific user           |

## Baskets

| HTTP Method | Endpoint                | Description                                            |
| ----------- | ----------------------- | ------------------------------------------------------ |
| GET         | /api/baskets/:user_id   | Returns the basket for a specific user                 |
| POST        | /api/baskets/:user_id   | Adds a clothing item to the basket for a specific user |
| DELETE      | /api/baskets/:basket_id | Deletes the basket for a specific user                 |
| PATCH       | /api/baskets/:basket_id | Updates the basket for a specific user                 |

## Errors

| HTTP Status Code | Error          | Description                               |
| ---------------- | -------------- | ----------------------------------------- |
| 404              | Path not found | The requested endpoint does not exist     |
| 400              | Bad Request    | The request payload is invalid            |
| 404              | Not Found      | The requested resource could not be found |

# Installation

## Prerequisites:

- NodeJS installed (Latest LTS recommended)
- PostgreSQL installed (Latest LTS recommended)

## To run this project locally:

1. Clone this repository and open the root directory in VScode or similar

2. Create a .env.development file in the root folder and paste the following into it:

```
PGDATABASE=clothes_database
```

3. Install project dependencies by typing npm install into the terminal

```
npm install
```

4. Setup and seed the database by typing the following in terminal:

```
npm run setup-db
```

```
npm run seed
```

5. To start the development server, which you can access at http://localhost:9090, type the following into the terminal:

```
npm start
```

You can also change the port it will run on, check the listen.js file
