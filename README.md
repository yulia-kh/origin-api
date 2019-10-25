# Origin API
- Live: https://murmuring-reef-29838.herokuapp.com

## Description
Origin API is the Express/NodeJS server responsible for handling API requests for Origin (https://github.com/yulia-kh/origin). While running, users can make the following API requests:
- `POST /api/users` Create a user account. Required fields:
  - first name
  - last name
  - user name
  - password (must contain at least one special character, digit, capital and lowercase letter, 8 -72 character long)

- `POST /api/auth/login` Get access to your account. Reqired fields:
  - username
  - password

- `GET /api/tree` Home page. Display user's family tree

- `POST /api/persons/:id/parents` Add an ancestor. Inserts record in `persons` table and relation to child in `parent_child` table

- `DELETE /api/persons/:id/` Delete an ancestor. Deletes record and relation to child from database

- `GET /api/persons/:id/` Get information about a person

- `PATCH /api/persons/:id/` Edit information about a person

## Getting Started
- Clone the repository and run `npm i`
- Create local Postgresql databases: `family` and `family-test`
- Run `mv example.env .env` and provide the local database locations within your `.env` file
- Run `npm run migrate and npm run migrate:test` to update each database with appropriate tables
- To seed, use terminal to enter root of application and run `psql -d family -f ./seeds/seed.family-tables.sql`
- Run npm run dev to start server in development mode

## Tech stack
- NodeJS
- Express
- Postgresql