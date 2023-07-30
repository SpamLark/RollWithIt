CREATE TABLE users (
    user_id varchar(36) NOT NULL,
    username varchar(20),
    email varchar(50) NOT NULL,
    is_admin boolean NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE INDEX index_users
ON users (user_id, username, email);

INSERT INTO user (username, email, is_admin)
VALUES ('testUser1', 'testUser1@invalid.com', false);

INSERT INTO user (username, email, is_admin)
VALUES ('testUser2', 'testUser2@invalid.com', true);

INSERT INTO user (email, is_admin)
VALUES ('testUser3@invalid.com', false);

SELECT * FROM user;
