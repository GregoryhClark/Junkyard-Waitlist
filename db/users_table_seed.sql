create table if not exists users (
    id serial PRIMARY key,
    user_name varchar (180),
    image_URL text,
    auth_id text,
    email varchar(50),
    phone varchar (15),
    is_admin bool DEFAULT false,
    is_premium bool DEFAULT false
);