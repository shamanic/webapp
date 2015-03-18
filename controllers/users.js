/**
 * show the user account page
 */
exports.myaccount = function(req, res) {
	res.render('pages/users/account', {
		title : 'Shamanic: [manage your account]'
	});
};

/** 
 * show the login page 
 */
exports.login = function(req, res) {
	res.render('pages/users/login', {
		title : 'Shamanic [login]'
	});
};

/** 
 * logout then redirect to home page 
 */
exports.logout = function(req, res) {

};

/** 
 * update and redirect to /users/account 
 */
exports.update = function(req, res) {

};

/**
 * user signup page
 */
exports.signup = function(req, res) {
	res.render('pages/users/signup', {
		title : 'Shamanic [join us!]'
	});
};

/** 
 * create user here 
 */
exports.create = function(req, res) {
	var uuid = require('node-uuid');
	var userObj = {email : req.body.email,username : req.body.username,password : req.body.password};
	userObj.uuid = uuid.v1();
	userObj.created_on = new req.db.DBExpr('NOW()');
	req.db.insert('users', userObj , function(err) {
	    if( ! err ) {
	    	res.render('pages/users/create', {
	    		title : 'Shamanic [join us!]',
	    		status: 'User account has been created'
	    	});
	        return true;
	    } else {
	    	res.render('pages/users/create', {
	    		title : 'Shamanic [join us!]',
	    		status: 'An error has occurred, your user account could not be created'
	    	});
	    	return false;
	    }
	} );
};

/** 
 * check if any user values are already existing 
 */
exports.checkExistingUserValues = function(req, res) {
	req.db.fetchRow('SELECT * FROM users WHERE '+req.body.property+'=\''+req.body.value+'\'', function(err, result) {
		var existingUserValue = 'value exists';
	    if( ! result ) {
	    	existingUserValue = 'value does not exist';
	    }
	    /** render a generic JSON response with status message */
	    res.render('pages/response', {
    		response : existingUserValue
    	});
	} );
};