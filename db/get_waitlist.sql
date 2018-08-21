select waitlist.id, make.make, model.model, year.year, color.color from waitlist
join make on make.id = waitlist.make
join model on model.id = waitlist.model
join year on year.id = waitlist.year
join color on color.id = waitlist.color
where user_id = $1; 