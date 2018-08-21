insert into users
(user_name, image_URL, auth_id )
values($1, $2, $3)
RETURNING *;