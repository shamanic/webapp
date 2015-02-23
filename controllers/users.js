exports.myaccount = function(req, res){
	res.render('pages/users/account', { title: 'Shamanic: [manage your account]' });
};
exports.login = function(req, res){
	res.render('pages/users/login', { title: 'Shamanic [login]' });
};
exports.logout = function(req, res){
	// logout then redirect to home page
};
exports.update = function(req, res){
	// update and redirect to /users/account
};
exports.signup= function(req, res){
	res.render('pages/users/signup', { title: 'Shamanic [join us!]' });
};