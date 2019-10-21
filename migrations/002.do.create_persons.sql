CREATE TABLE persons (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  date_of_death DATE,
  details TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);