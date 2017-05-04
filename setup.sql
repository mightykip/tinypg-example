CREATE DATABASE tinypg_example;

\connect tinypg_example;

CREATE SCHEMA IF NOT EXISTS tinypg;

SET search_path TO tinypg, public;

DROP TABLE IF EXISTS tinypg.address;
DROP TABLE IF EXISTS tinypg.person;

CREATE TABLE tinypg.person (
   person_id serial PRIMARY KEY,
   first_name text,
   last_name text
);

CREATE TABLE tinypg.address (
   address_id serial PRIMARY KEY,
   person_id int,
   address text,
   city text,
   state text,
   zip int,
   FOREIGN KEY (person_id) REFERENCES tinypg.person
);

WITH new_person AS (
   INSERT INTO tinypg.person (first_name, last_name) VALUES ('Joe', 'Andaverde')
   RETURNING *
)
INSERT INTO tinypg.address (
   person_id, address, city, state, zip)
VALUES (
   (SELECT person_id FROM new_person),
   '123 W 10th St',
   'Shawnee',
   'Kansas',
   66666
);