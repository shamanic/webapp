/**
 * Model for users in the system
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */

/**
 * get by username
 */
exports.getByUserName = function(req, userName) {
  return new req.promise(function (resolve, reject) {
	  req.db.fetchRow('SELECT * FROM users WHERE username = ?', [userName], function(err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });	
}

/**
 * get by email
 */
exports.getByEmail = function(req, emailAddress) {
  return new req.promise(function (resolve, reject) {
	  req.db.fetchRow('SELECT * FROM users WHERE email = ?', [emailAddress], function(err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * for given name value pair, check if it exists in the database
 */
exports.checkNameValueExists = function(req, name, value) {
	// @todo have this query escaped safely from SQL injection attempts
	return new req.promise(function (resolve, reject) {
		req.db.fetchRow('SELECT * FROM users WHERE ' + name + '=\'' + value + '\'', function(err, result) {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});	
}

/**
 * update the user information with the bcrypted password hashed out
 */
exports.updateNameAndPassword  = function(req, fullname, password) {
	return new req.promise(function (resolve, reject) {
		var salt = req.bcrypt.genSaltSync(10);
		var hashedPassword = req.bcrypt.hashSync(password, salt);
		var userObj = {fullname: fullname, password : hashedPassword};
		req.db.update('users', userObj , [[ 'uuid=?', req.session.user.uuid]], function(err) {
			if (err) {
				return reject(err);
			}
			return resolve(true);
		});
	});	
}

/**
 * update user last login timestamp
 */
exports.updateLastLogin = function(req, uuid) {
    var lastLogin = new req.db.DBExpr('NOW()');
    var userObj = {last_login: lastLogin};
	req.db.update('users', userObj , [[ 'uuid=?', uuid]], function(err) {});
}

/**
 * create a temporary password and recover email message for a user
 */
exports.recoverPassword = function (req, email) {

	// generate random password
	var seed = Math.floor(Math.random() * (10000000 - 100000) + 1);
	var uuid = require('node-uuid');
	var uuidV1 = uuid.v1();
	uuidV1 = uuidV1.substring(0, 8)
	var randomPassword = seed + uuidV1;

	// bcrypted password for storage
	var salt = req.bcrypt.genSaltSync(10);
	var hashedPassword = req.bcrypt.hashSync(randomPassword, salt);

	// update the user to have the random password
	var userObj = {password : hashedPassword};
	req.db.update('users', userObj , [[ 'email=?', email]], function(err) {
	    if( ! err ) {
			// send the recovery message
			req.emailHelper.emailUser(req, email, "Account recovery - " + req.siteEnvironment.websiteConfig.websiteName, "This address has been requested for a password reset on " + req.siteEnvironment.websiteConfig.websiteName + ".  \n\nYour account password is now: " + randomPassword + " \n\nIf this action is unfamiliar to you, please let us know.  -" + req.siteEnvironment.websiteConfig.websiteEmailFromName);
	    }
    });
}

/**
 * create user object with the bcrypted password
 */
exports.createNew = function(req) {
  return new req.promise(function (resolve, reject) {
	  var salt = req.bcrypt.genSaltSync(10);
	  var hashedPassword = req.bcrypt.hashSync(req.body.password, salt);
	  var userObj = {fullname: req.body.fullname, email : req.body.email,username : req.body.username,password : hashedPassword};
	  var uuid = require('node-uuid');
	  userObj.uuid = uuid.v1();
	  userObj.created_on = new req.db.DBExpr('NOW()');
	  req.db.insert('users', userObj , function(err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    }); 
  });
}

exports.isAdmin = function() {
	
}
