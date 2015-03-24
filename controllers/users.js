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
 * upon valid login credentials 
 * 	set secure cookie with the user's info
 */
exports.checkLogin = function(req, res) { 
	
	console.log(res.body);
	
    //req.session.user = user;
    res.redirect('/user/account');
}

/** 
 * logout then redirect to home page 
 */
exports.logout = function(req, res) {
      req.session.reset();
      res.redirect('/');
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
	
	/** create user object with the bcrypted password*/
	var bcrypt = require('bcrypt');
	var salt = bcrypt.genSaltSync(10);
	var hashedPassword = bcrypt.hashSync(req.body.password, salt);
	var userObj = {email : req.body.email,username : req.body.username,password : hashedPassword};
	
	/** create new UUID and insert user */
	var uuid = require('node-uuid');
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