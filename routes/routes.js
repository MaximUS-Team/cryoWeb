module.exports = function(app, passport){

	//home page
	app.get('/', function(req, res){
		res.render('index.ejs')

	});

	//login
	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage')});

	});

	//signup
	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage')});
	});

	//signupt

	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage')});

	});

	//profile selection

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {
			user : req.user //get the user out of session and pass to template
		});
	});

	//logout

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});


};

function isLoggedIn(req, res, next) {
	// if user is authenticated carry one
	if (req.isAuthenticated())
		return next();

	// if they arent redirect to home page
	res.redirect('/')
}