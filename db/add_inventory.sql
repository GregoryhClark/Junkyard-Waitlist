INSERT INTO inventory (make, model, year, color)
VALUES 
(
(select id from make where make = $1),
(select id from model where model = $2),
(select id from year where year = $3),
(select id from color where color = $4)
)
 