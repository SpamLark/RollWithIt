CREATE TABLE player_registration (
    user_id int NOT NULL,
    game_instance_id int NOT NULL,
    CONSTRAINT PK_player_registration PRIMARY KEY (user_id, game_instance_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (game_instance_id) REFERENCES game_instance(game_instance_id)
);

CREATE INDEX index_player_registration
ON player_registration (user_id, game_instance_id);

INSERT INTO player_registration
VALUES (1, 1);

INSERT INTO player_registration
VALUES (2, 1);

INSERT INTO player_registration
VALUES (3, 1);

-- Check primary key constraint
INSERT INTO player_registration
VALUES (3, 1);

-- Check foreign key constraint user_id
INSERT INTO player_registration
VALUES (4, 1);

-- Check foreign key constraint game_instance_id
INSERT INTO player_registration
VALUES (1, 5);

SELECT * FROM player_registration;