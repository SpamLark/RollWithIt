SELECT username, game_night_location, game_night_datetime
FROM user 
	JOIN player_registration ON user.user_id = player_registration.user_id
    JOIN game_instance ON player_registration.game_instance_id = game_instance.game_instance_id
    JOIN game_night ON game_instance.game_night_id = game_night.game_night_id
WHERE game_name = 'Scythe';