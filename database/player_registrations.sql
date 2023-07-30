CREATE TABLE player_registrations (
    user_id varchar(36) NOT NULL,
    game_instance_id int NOT NULL,
    CONSTRAINT PK_player_registrations PRIMARY KEY (user_id, game_instance_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_instance_id) REFERENCES game_instances(game_instance_id)
);

CREATE INDEX index_player_registrations
ON player_registrations (user_id, game_instance_id);

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