/**
 * Shamanic Web Application
 * @copyright 2015 Shamanic
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
/**
 * show the user account page
 */
exports.myaccount = function(req, res) {
	var SiteEnvironment = require('../../config/environment.js');
	req.db.fetchRow('SELECT fullname FROM users WHERE username = ?', [req.session.user.username], function(err, result) {
	    if( ! err ) {
			res.render('pages/users/account', {
				title : SiteEnvironment.websiteConfig.websiteName + ' [Manage Account]',
				websiteName: SiteEnvironment.websiteConfig.websiteName,
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
	var SiteEnvironment = require('../../config/environment.js');
	res.render('pages/users/login', {
		title : SiteEnvironment.websiteConfig.websiteName + ' [login]',
		websiteName: SiteEnvironment.websiteConfig.websiteName
	});
};

/**
 * upon valid login credentials 
 * 	set secure cookie with the user's info
 */
exports.checkLogin = function(req, res) {
	req.db.fetchRow('SELECT uuid, username,password FROM users WHERE username = ?', [req.body.username], function(err, result) {

		// if results and no errors check the user password against DB and set the user to the session
		try{
			if (req.bcrypt.compareSync(req.body.password, result.password)) {
			    req.session.user = {uuid:result.uuid,username:result.username};
			    
			    // update user last login timestamp
			    var lastLogin = new req.db.DBExpr('NOW()');
                var userObj = {last_login: lastLogin};
    			req.db.update('users', userObj , [[ 'uuid=?', result.uuid]], function(err) {});
			    
			    // render success message, user found
			    res.render('pages/response', {
		    	    response : 'user login sucessful'
		    	});
				
			} else {
			    // render error message, user not found
			    res.render('pages/response', {
		    		response : 'not found'
		    	});
			}
		} catch (err) {
		    // render error message, user not found
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
	req.session = null;
	res.redirect('/');
};

/**
 * forgot password dialog
 */
exports.forgot = function(req, res) {
	var SiteEnvironment = require('../../config/environment.js');
	res.render('pages/users/forgot', {
		title : SiteEnvironment.websiteConfig.websiteName + ' [Forgot Login]',
		websiteName: SiteEnvironment.websiteConfig.websiteName
	});
};

/**
 * search for user email recovery password  
 */
exports.checkForgot = function(req, res) {

	// search by username, but only if no email else we always search by that
	if (req.body.username.length > 0 && req.body.email.length == 0) {
		req.db.fetchRow('SELECT email FROM users WHERE username = ?', [req.body.username], function(err, result) {
			try {
				if (typeof result.email !== 'undefined' && result.email !== null) {
					// render success message, and email recovery message
					recoverUser(result.email, req.bcrypt, req.db);
				    res.render('pages/response', {
					    response : 'user password recovered'
					});
				}
			} catch (err) {
				// render error message, user not found
				console.log(err);
			    res.render('pages/response', {
		    		response : 'not found'
		    	});
			}
		} );	
	}
	
	// search by email
	if (req.body.email.length > 0) {
		req.db.fetchRow('SELECT email FROM users WHERE email = ?', [req.body.email], function(err, result) {
			try {
				if (typeof result.email !== 'undefined' && result.email !== null) {
					// render success message, and email recovery message
					recoverUser(result.email, req.bcrypt, req.db);
				    res.render('pages/response', {
					    response : 'user password recovered'
					});
				}
			} catch (err) {
				// render error message, user not found
				console.log(err);
			    res.render('pages/response', {
		    		response : 'not found'
		    	});
			}
		} );	
	}
};

//  create a temporary password and recover email message for a user
var recoverUser = function(email, bcrypt, db) {
	
	// get website environment settings
	var SiteEnvironment = require('../../config/environment.js');
	
	// generate random password
	var seed = Math.floor(Math.random() * (10000000 - 100000) + 1);
	var uuid = require('node-uuid');
	var uuidV1 = uuid.v1();
	uuidV1 = uuidV1.substring(0, 8)
	var randomPassword = seed + uuidV1;
	
	// bcrypted password for storage
	var salt = bcrypt.genSaltSync(10);
	var hashedPassword = bcrypt.hashSync(randomPassword, salt);
	
	// update the user to have the random password
	var userObj = {password : hashedPassword};
	db.update('users', userObj , [[ 'email=?', email]], function(err) {
	    if( ! err ) {
    		// send the recovery message
    		emailUser(email, "Account recovery - " + SiteEnvironment.websiteConfig.websiteName, "This address has been requested for a password reset on " + SiteEnvironment.websiteConfig.websiteName + ".  \n\nYour account password is now: "+randomPassword+" \n\nIf this action is unfamiliar to you, please let us know.  -" + SiteEnvironment.websiteConfig.websiteEmailFromName);
	    } 
    });
};

/** 
 * update and redirect to /users/account 
 */
exports.update = function(req, res) {
	
	// create user object with the bcrypted password
	var salt = req.bcrypt.genSaltSync(10);
	var hashedPassword = req.bcrypt.hashSync(req.body.password, salt);
	
	// update the user information and return a success / fail
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
	var SiteEnvironment = require('../../config/environment.js');
	res.render('pages/users/signup', {
		title : SiteEnvironment.websiteConfig.websiteName + ' [Join Us!]',
		websiteName: SiteEnvironment.websiteConfig.websiteName
	});
};

/** 
 * create user here 
 */
exports.create = function(req, res) {
	
	// get website environment settings
	var SiteEnvironment = require('../../config/environment.js');
	
	// create user object with the bcrypted password
	var salt = req.bcrypt.genSaltSync(10);
	var hashedPassword = req.bcrypt.hashSync(req.body.password, salt);
	var userObj = {fullname: req.body.fullname, email : req.body.email,username : req.body.username,password : hashedPassword};
	
	// create new UUID and insert user
	var uuid = require('node-uuid');
	userObj.uuid = uuid.v1();
	userObj.created_on = new req.db.DBExpr('NOW()');
	req.db.insert('users', userObj , function(err) {
	    if( ! err ) {
	    	res.render('pages/users/create', {
	    		title : SiteEnvironment.websiteConfig.websiteName + ' [Join Us!]',
	    		websiteName: SiteEnvironment.websiteConfig.websiteName,
	    		status: 'User account has been created.'
	    	});
	        return true;
	    } else {
	    	res.render('pages/users/create', {
	    		title : SiteEnvironment.websiteConfig.websiteName + ' [Join Us!]',
	    		websiteName: SiteEnvironment.websiteConfig.websiteName,
	    		status: 'An error has occurred, your user account could not be created.'
	    	});
	    	return false;
	    }
	} );
	
	// send the thank you for signing up email
	emailUser(req.body.email, "Thank you for registering your account on "+ SiteEnvironment.websiteConfig.websiteName + "!", "This address has been used to create an account on "+ SiteEnvironment.websiteConfig.websiteName + ".  \n\nIf this action is unfamiliar to you, please let us know.  -" + SiteEnvironment.websiteConfig.websiteEmailFromName);
};

/** 
 * check if any user values are already existing 
 */
exports.checkExistingUserValues = function(req, res) {
	
	// @todo have this query escaped safely from SQL injection attempts
	req.db.fetchRow('SELECT * FROM users WHERE '+req.body.property+'=\''+req.body.value+'\'', function(err, result) {
		var existingUserValue = 'value exists';
	    if( ! result ) {
	    	existingUserValue = 'value does not exist';
	    }
	    // render a generic JSON response with status message
	    res.render('pages/response', {
    		response : existingUserValue
    	});
	} );
};

/**
 * email user text based email with subject and message
 */
var emailUser = function(address, subject, message) {
	var AppSettings = require('../../config/settings.js');
	var SiteEnvironment = require('../../config/environment.js');
	var email = require("../node_modules/emailjs/email");
	var server = email.server.connect({
		user : AppSettings.SMTPConfig.fromAddress,
		password : AppSettings.SMTPConfig.sendMailPassword,
		host : AppSettings.SMTPConfig.mailHost,
		ssl : true
	});
	server.send({
		from : SiteEnvironment.websiteConfig.websiteEmailFromName + " <"+AppSettings.SMTPConfig.fromAddress+">",
		to : address,
		subject : subject,
		text : message,
	}, function(err, message) {
		console.log(err || message);
	});
};

/**
 * get list of users
 */
exports.getUsers = function(req, res) {

}

/**
 * get list of users JSON string
 */
exports.getUsersJSON = function(req, res) {

}
