INSERT INTO waitlist(user_id, color, make, model, year)
VALUES 
(
$1, 
(select id from color where color = $2),
(select id from make where make = $3), 
(select id from model where model = $4), 
(select id from year where year = $5))