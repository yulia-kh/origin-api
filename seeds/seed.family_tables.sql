BEGIN;

TRUNCATE
  persons,
  parent_child,
  users,
  user_person
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password, date_created, date_modified)
VALUES 
  ('dunder', '$2a$12$/lxkBBICqcifWY91Q17rhObaTzsGqSDx1uayd4W24ytkTcaD26wKu', DEFAULT, null),
  ('joe', '$2a$12$UY/z721vjOmEIpBkQ438n.Ys0LDOhuTNU2X3xIBtO1I9PAgY0Q5Hq', DEFAULT, null);

INSERT INTO persons (first_name, last_name, date_of_birth, date_of_death, details, user_id)
VALUES 
  ('Dunder', 'Mifflin', '2000-09-19', null, 'Dunder the first user', 1),
  ('Joe', 'Doe', '1970-10-01', null, 'Joe the second user', 2),
  ('Dana', 'Mifflin', '1960-04-22', null, 'Dunders mother', 1);


INSERT INTO user_person (user_id, person_id)
VALUES
  (1, 1),
  (2, 2);

INSERT INTO parent_child (child_id, parent_id, relation_to_child)
VALUES
  (1, 3, 'Mother');

COMMIT;