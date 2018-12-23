-- create a DB named "coin-dock" and then paste the following queries to generate the needed tables

CREATE TABLE "person" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (80) NOT NULL,
    "username" VARCHAR (80) UNIQUE,
    "password" VARCHAR (1000),
    "facebook_id" VARCHAR (80) UNIQUE,
    "fb_access_token" VARCHAR (250) UNIQUE,
    "facebook_image" VARCHAR(150) NOT NULL DEFAULT 'images/facebook-avatar.jpg';
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