select users.id, users.user_name, email, is_premium from users 
join waitlist on waitlist.user_id = users.id 
join make on make.id = waitlist.make
join model on model.id = waitlist.model
join year on year.id = waitlist.year
join color on color.id = waitlist.color
where make.make = $1
and model.model = $2
and year.year = $3
and color.color = $4


