CREATE TABLE game_instance (
    game_instance_id int NOT NULL AUTO_INCREMENT,
    host_id int NOT NULL,
    game_night_id int NOT NULL,
    game_name varchar(255) NOT NULL,
    min_players int NOT NULL,
    max_players int NOT NULL,
    PRIMARY KEY (game_instance_id),
    FOREIGN KEY (host_id) REFERENCES user(user_id),
    FOREIGN KEY (game_night_id) REFERENCES game_night(game_night_id),
    CONSTRAINT ck_max_players CHECK (max_players > 0 AND max_players >= min_players),
    CONSTRAINT ck_min_players CHECK (min_players > 0 AND min_players <= max_players)
);

CREATE INDEX index_game_instance
ON game_instance (game_instance_id, host_id, game_night_id, game_name);

INSERT INTO game_instance (host_id, game_night_id, game_name, min_players, max_players)
VALUES (1, 1, 'Scythe', 3, 8);

INSERT INTO game_instance (host_id, game_night_id, game_name, min_players, max_players)
VALUES (1, 2, 'Catan', 3, 4);

-- Constraint check max players less than min players
INSERT INTO game_instance (host_id, game_night_id, game_name, min_players, max_players)
VALUES (1, 2, 'Everdell', 3, 2);

-- Constraint check min players less than 0
INSERT INTO game_instance (host_id, game_night_id, game_name, min_players, max_players)
VALUES (1, 2, 'Everdell', -1, 2);

-- Constraint check user does not exist
INSERT INTO game_instance (host_id, game_night_id, game_name, min_players, max_players)
VALUES (31, 2, 'Everdell', 2, 4);

SELECT * FROM game_instance;