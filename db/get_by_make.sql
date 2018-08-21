select * from model
join make on make.id = model.make_id
where make = $1