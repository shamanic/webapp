/** play the game */
exports.index = function(req, res){
	res.render('pages/game', { title: 'Shamanic .:PLAY:.' });
};