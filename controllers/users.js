/**
 * show the user account page
 */
exports.myaccount = function(req, res) {
	req.db.fetchRow('SELECT fullname FROM users WHERE username = ?', [req.session.user.username], function(err, result) {
	    if( ! err ) {
			res.render('pages/users/account', {
				title : 'Shamanic [Manage Account]',
				username: req.session.user.username,
				fullname: result.fullname
			});		    
	    }
	});
};

/** 
 * show the login page 
 */
exports.login = function(req, res) {
	res.render('pages/users/login', {
		title : 'Shamanic [Login]'
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
			    
			    /** update user last login timestamp */
			    var lastLogin = new req.db.DBExpr('NOW()');
                var userObj = {last_login: lastLogin};
    			req.db.update('users', userObj , [[ 'uuid=?', result.uuid]], function(err) {});
			    
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
};

/** 
 * logout then redirect to home page 
 */
exports.logout = function(req, res) {
	req.session.user = false;
	res.redirect('/');
};

/**
 * forgot password dialog
 */
exports.forgot = function(req, res) {
	res.render('pages/users/forgot', {
		title : 'Shamanic [Forgot Login]'
	});
};

/**
 * search for user email recovery password  
 */
exports.checkForgot = function(req, res) {

	/** search by username, but only if no email else we always search by that */
	if (req.body.username.length > 0 && req.body.email.length == 0) {
		req.db.fetchRow('SELECT email FROM users WHERE username = ?', [req.body.username], function(err, result) {
			try {
				if (typeof result.email !== 'undefined' && result.email !== null) {
					/** render success message, and email recovery message */
					recoverUser(result.email, req.bcrypt, req.db);
				    res.render('pages/response', {
					    response : 'user password recovered'
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
	
	/** search by email */
	if (req.body.email.length > 0) {
		req.db.fetchRow('SELECT email FROM users WHERE email = ?', [req.body.email], function(err, result) {
			try {
				if (typeof result.email !== 'undefined' && result.email !== null) {
					/** render success message, and email recovery message */
					recoverUser(result.email, req.bcrypt, req.db);
				    res.render('pages/response', {
					    response : 'user password recovered'
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
};

/**  create a temporary password and recover email message for a user */
var recoverUser = function(email, bcrypt, db) {
	
	/** generate random password */
	var seed = Math.floor(Math.random() * (10000000 - 100000) + 1);
	var uuid = require('node-uuid');
	var uuidV1 = uuid.v1();
	uuidV1 = uuidV1.substring(0, 8)
	var randomPassword = seed + uuidV1;
	
	/** bcrypted password for storage */
	var salt = bcrypt.genSaltSync(10);
	var hashedPassword = bcrypt.hashSync(randomPassword, salt);
	
	/** update the user to have the random password */
	var userObj = {password : hashedPassword};
	db.update('users', userObj , [[ 'email=?', email]], function(err) {
	    if( ! err ) {
    		/** send the recovery message */
    		emailUser(email, "Account recovery - shamanic.io", "This address has been requested for a password reset on Shamanic.io.  \n\nYour account password is now: "+randomPassword+" \n\nIf this action is unfamiliar to you, please let us know.  -Shamanic Team");
	    } 
    });
};

/** 
 * update and redirect to /users/account 
 */
exports.update = function(req, res) {
	
	/** create user object with the bcrypted password*/
	var salt = req.bcrypt.genSaltSync(10);
	var hashedPassword = req.bcrypt.hashSync(req.body.password, salt);
	
	/** update the user information and return a success / fail */
	var userObj = {fullname: req.body.fullname, password : hashedPassword};
	req.db.update('users', userObj , [[ 'uuid=?', req.session.user.uuid]], function(err) {
	    if( ! err ) {
		    res.render('pages/response', {
	    	    response : 'User Updated Successfully.'
	    	});
	    } else {
		    res.render('pages/response', {
	    	    response : 'User information could not be updated.'
	    	});
	    }
    } );
};

/**
 * user signup page
 */
exports.signup = function(req, res) {
	res.render('pages/users/signup', {
		title : 'Shamanic [Join Us!]'
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
	    		title : 'Shamanic [Join Us!]',
	    		status: 'User account has been created.'
	    	});
	        return true;
	    } else {
	    	res.render('pages/users/create', {
	    		title : 'Shamanic [Join Us!]',
	    		status: 'An error has occurred, your user account could not be created.'
	    	});
	    	return false;
	    }
	} );
	
	/** send the thank you for signing up email */
	emailUser(req.body.email, "Thank you for registering your account on Shamanic.io!", "This address has been used to create an account on Shamanic.io.  \n\nIf this action is unfamiliar to you, please let us know.  -Shamanic Team");
};

/** 
 * check if any user values are already existing 
 */
exports.checkExistingUserValues = function(req, res) {
	
	/** @todo have this query escaped safely from SQL injection attempts */
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

/**
 * email user text based email with subject and message
 */
var emailUser = function(address, subject, message) {
	var AppSettings = require('../settings/settings.js');
	var email = require("../node_modules/emailjs/email");
	var server = email.server.connect({
		user : AppSettings.SMTPConfig.fromAddress,
		password : AppSettings.SMTPConfig.sendMailPassword,
		host : AppSettings.SMTPConfig.mailHost,
		ssl : true
	});
	server.send({
		from : AppSettings.SMTPConfig.fromAddress + " <"+AppSettings.SMTPConfig.fromAddress+">",
		to : address,
		subject : subject,
		text : message,
	}, function(err, message) {
		console.log(err || message);
	});
};