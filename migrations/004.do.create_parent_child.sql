CREATE TABLE parent_child (
child_id INTEGER REFERENCES persons(id) ON DELETE CASCADE NOT NULL,
parent_id INTEGER REFERENCES persons(id) ON DELETE CASCADE NOT NULL,
relation_to_child TEXT NOT NULL
);
