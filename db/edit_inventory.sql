update inventory
set make = (select id from make where make =$1),
model = (select id from model where model = $2),
year = (select id from year where year = $3),
color = (select id from color where color = $4) 
where id = $5