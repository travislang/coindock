-- create a DB named "coin-dock" and then paste the following queries to generate the needed tables

CREATE TABLE "person" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (80) NOT NULL,
    "username" VARCHAR (80) UNIQUE,
    "alerts_total" INT DEFAULT 0,
    "socket" VARCHAR(100),
    "password" VARCHAR (1000),
    "facebook_id" VARCHAR (80) UNIQUE,
    "facebook_image" VARCHAR(150) NOT NULL DEFAULT 'images/facebook-avatar.jpg',
    "fb_access_token" VARCHAR (250) UNIQUE,
    "push_endpoint" VARCHAR(200),
    "p256dh" VARCHAR(200),
    "auth" VARCHAR(200)
);


CREATE TABLE "portfolio" (
	"id" SERIAL PRIMARY KEY,
	"portfolio_name" VARCHAR (80) NOT NULL DEFAULT 'My First Portfolio',
	"person_id" INT REFERENCES "person" NOT NULL
);

CREATE TABLE "symbols" (
	"id" SERIAL PRIMARY KEY,
	"symbol"  VARCHAR (20),
	"logo" VARCHAR(250),
	"symbol_name" VARCHAR (80),
	"base_asset" VARCHAR(25),
	"quote_asset" VARCHAR(25),
	"last_price" VARCHAR(50),
	"volume" VARCHAR(50),
	"price_change" VARCHAR(25)
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
	"symbol_id" INT REFERENCES "symbols",
	"alerts_on" BOOLEAN NOT NULL DEFAULT TRUE,
	"alert_sent" VARCHAR(150)
	"order" INT
);
