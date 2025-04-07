CREATE SCHEMA IF NOT EXISTS agroann;
SET search_path TO agroann;

CREATE TABLE entities(
    id serial primary key, 
    name varchar(70) NOT NULL
);
CREATE TABLE relationship(
    type varchar(10) NOT NULL,
    id1 integer REFERENCES entities(id) ON DELETE CASCADE,
    id2 integer NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    unique(type, id1, id2)
);
CREATE TABLE articles(
    id serial primary key,
    title text,
    abstract text NOT NULL,
    doi text,
    url text 
);
CREATE TABLE mapping(
    id_articles integer REFERENCES articles(id) ON DELETE CASCADE,
    id_entities integer REFERENCES entities(id) ON DELETE CASCADE,
    primary key (id_articles, id_entities)
);
ALTER SEQUENCE articles_id_seq MINVALUE 0 RESTART WITH 0;