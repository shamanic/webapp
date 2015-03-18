/** show the main home page */
exports.index = function(req, res){
	res.render('pages/index', { title: 'Welcome to Shamanic a new kind of MMORPG' });
};