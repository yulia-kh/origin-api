Origin API

To access the live API endpoint, use the following URL: https://fast-eyrie-75698.herokuapp.com/

Getting Started
Clone the repository and run npm i
Create local Postgresql databases: family and family-test
Run mv example.env .env and provide the local database locations within your .env file
Run npm run migrate and npm run migrate:test to update each database with appropriate tables
To seed, use terminal to enter root of application and run (NOTE: add username/password if you elected to apply these to your configuration): psql -d family -f ./seeds/seed.family-tables.sql
Run npm run dev to start server 


Description
* Will require valid JWT token.

Origin API is the Express/NodeJS server responsible for handling API requests for Origin (https://github.com/yulia-kh/origin). While running, users can make the following API requests:

