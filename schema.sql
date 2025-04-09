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

CREATE FUNCTION get_type_of(ent varchar)
RETURNS TABLE( name varchar, id int) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE type_of AS (
    SELECT e.name, e.id
    FROM entities e
    WHERE e.name = ent
    
    UNION ALL

    SELECT e.name, e.id
    FROM relationship r
    JOIN entities e ON e.id = r.id1
    JOIN type_of t ON t.id = r.id2
    WHERE r.type = 'type_of'
    )

    SELECT * FROM type_of;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION get_same_as(ent varchar)
RETURNS TABLE(name varchar, id int) AS $$
BEGIN
    RETURN QUERY
    select   e2.name, e2.id
    from entities e
    join relationship r on r.id1 = e.id
    join entities e2 on e2.id = r.id2
    where e.name = ent;
END;
$$ LANGUAGE plpgsql;
