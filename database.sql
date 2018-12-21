-- create a DB named "coin-dock" and then paste the following queries to generate the needed tables

CREATE TABLE "person" (
    "id" SERIAL PRIMARY KEY,
    "full_name" VARCHAR (80) NOT NULL,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "portfolio" (
	"id" SERIAL PRIMARY KEY,
	"portfolio_name" VARCHAR (80) NOT NULL,
	"person_id" INT REFERENCES "person"
);

CREATE TABLE "symbols" (
	"id" SERIAL PRIMARY KEY,
	"symbol"  VARCHAR (20) UNIQUE NOT NULL,
	"logo" VARCHAR(250),
	"symbol_name" VARCHAR (80) NOT NULL
);

CREATE TABLE "portfolio_symbols" (
	"id" SERIAL PRIMARY KEY,
	"portfolio_id" INT REFERENCES "portfolio",
	"symbol_id" INT REFERENCES "symbols"
);

CREATE TABLE "alerts" (
	"id" SERIAL PRIMARY KEY,
	"person_id" INT NOT NULL REFERENCES "person",
	"price_threshold" DECIMAL NOT NULL,
	"less_than" BOOLEAN NOT NULL,
	"symbol_id" INT REFERENCES "symbols"
);