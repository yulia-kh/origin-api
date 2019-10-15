BEGIN;

TRUNCATE
  parent_child,
  persons
  RESTART IDENTITY CASCADE;

INSERT INTO persons (first_name, last_name, date_of_birth, date_of_death, details)
VALUES 
  ('Joan', 'Doe', '2000-09-19', null, null),
  ('Jane', 'Doe', '1970-10-01', null, 'best mom ever'),
  ('Joe', 'Doe', '1972-03-05', null, 'best dad ever');

INSERT INTO parent_child (child_id, parent_id, relation_to_child)
VALUES
  (1, 2, 'mother'),
  (1, 3, 'father');

COMMIT;