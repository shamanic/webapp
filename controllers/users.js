/**
 * show the user account page
 */
exports.myaccount = function(req, res) {
	res.render('pages/users/account', {
		title : 'Shamanic: [manage your account]',
		username: req.session.user.username,
		status: ''
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
	req.db.fetchRow('SELECT uuid, username,password FROM users WHERE username = ?', [req.body.username], function(err, result) {

		/** if results and no errors check the user password against DB and set the user to the session */
		try{
			if (req.bcrypt.compareSync(req.body.password, result.password)) {
			    req.session.user = {uuid:result.uuid,username:result.username};
			    /** render success message, user found */
			    res.render('pages/response', {
		    	    response : 'user login sucessful'
		    	});
				
			} else {
			    /** render error message, user not found */
			    res.render('pages/response', {
		    		response : 'not found'
		    	});
			}
		} catch (err) {
		    /** render error message, user not found */
			console.log(err);
		    res.render('pages/response', {
	    		response : 'not found'
	    	});		    
		}
	} );
}

/** 
 * logout then redirect to home page 
 */
exports.logout = function(req, res) {
	req.session.user = false;
	res.redirect('/');
};

/** 
 * update and redirect to /users/account 
 */
exports.update = function(req, res) {
	
	/** create user object with the bcrypted password*/
	var salt = req.bcrypt.genSaltSync(10);
	var hashedPassword = req.bcrypt.hashSync(req.body.password, salt);
	var userObj = {fullname: req.body.fullname, password : hashedPassword};	
	
	
		
	//req.db.update('user', JohnDataUpdate , [ 'first_name=\'John\'', ['last_name=?', 'Foo'] ], function(err) {});
    
	req.db.update('user', userObj , [[ 'uuid=?', req.session.user.uuid]], function(err) {
		console.log(err);
    } );
	
	
	
//	
//	
//	
//	req.db.insert('users', userObj , function(err) {
//	    if( ! err ) {
//	    	res.render('pages/users/account', {
//	    		title : 'Shamanic: [manage your account]',
//	    		username: req.session.user.username,
//	    		status: 'Your Account has been updated.'
//	    	});
//	        return true;
//	    } else {
//	    	res.render('pages/users/account', {
//	    		title : 'Shamanic: [manage your account]',
//	    		username: req.session.user.username,
//	    		status: 'An error has occurred, your user account could not be updated.'
//	    	});
//	    	return false;
//	    }
//	} );
	
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
	var salt = req.bcrypt.genSaltSync(10);
	var hashedPassword = req.bcrypt.hashSync(req.body.password, salt);
	var userObj = {fullname: req.body.fullname, email : req.body.email,username : req.body.username,password : hashedPassword};
	
	/** create new UUID and insert user */
	var uuid = require('node-uuid');
	userObj.uuid = uuid.v1();
	userObj.created_on = new req.db.DBExpr('NOW()');
	req.db.insert('users', userObj , function(err) {
	    if( ! err ) {
	    	res.render('pages/users/create', {
	    		title : 'Shamanic [join us!]',
	    		status: 'User account has been created.'
	    	});
	        return true;
	    } else {
	    	res.render('pages/users/create', {
	    		title : 'Shamanic [join us!]',
	    		status: 'An error has occurred, your user account could not be created.'
	    	});
	    	return false;
	    }
	} );
};

/** 
 * check if any user values are already existing 
 */
exports.checkExistingUserValues = function(req, res) {
	
	/** @todo have this query escaped safely */
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