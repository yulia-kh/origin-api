BEGIN;

TRUNCATE
  parent_child,
  persons
  RESTART IDENTITY CASCADE;

INSERT INTO
