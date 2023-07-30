CREATE TABLE game_nights (
    game_night_id int NOT NULL auto_increment,
    game_night_location varchar(20) NOT NULL,
    game_night_datetime datetime NOT NULL,
    PRIMARY KEY(game_night_id)
);

CREATE INDEX index_game_nights
ON game_nights (game_night_id, game_night_location, game_night_datetime);

INSERT INTO game_nights (game_night_location, game_night_datetime)
VALUES ('UHQ', '2023-05-28 19:30');

INSERT INTO game_nights (game_night_location, game_night_datetime)
VALUES ('Trade City', '2023-07-06 20:30:00');

SELECT * FROM game_nights;