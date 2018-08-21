select inventory.id, make.make, model.model, inventory.date_entered, year.year, color.color from inventory
join make on make.id = inventory.make
join model on model.id = inventory.model
join year on year.id = inventory.year
join color on color.id = inventory.color
where make.make = $1 and model.model = $2 and year.year = $3 and color.color = $4