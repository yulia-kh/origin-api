CREATE TABLE parent_child (
child_id INTEGER REFERENCES persons(id) NOT NULL,
parent_id INTEGER REFERENCES persons(id) NOT NULL,
relation_to_child TEXT NOT NULL
);