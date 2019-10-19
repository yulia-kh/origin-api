CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now(),
  date_modified TIMESTAMP
);

CREATE TABLE user_person (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  person_id INTEGER REFERENCES persons(id) ON DELETE CASCADE NOT NULL
);
