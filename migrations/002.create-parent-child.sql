CREATE TABLE parent_child (
child_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
parent_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
relation_to_child TEXT NOT NULL
);