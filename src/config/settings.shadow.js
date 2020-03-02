/**
 * SHADOW FILE
 * 		(please create your own personal 'settings.js' file with your own values from the template below)
 *
 * 		WARNING:
 * 				Never check in your own 'settings.js' to GIT, if it's a public repo and you'll give away your passwords :)
 */

// postgres DB
exports.DBConfig = {
	db : {
		host : "localhost",
		username : "vagrant",
		password : "vagrant",
		database : "shamanic"
	}
};

// SMTP config, send admin emails to users
exports.SMTPConfig = {
	mailHost : 'mail.privateemail.com',
	fromAddress : 'admin@shamanic.io',
	sendMailPassword : 'mail host password here'
};

// cookie session keys
exports.sessionKeys = {
	cookieParserKey : 'secret string value here',
	sessionKey: 'another secret string value here'
};

// 3rd party API session keys
exports.apiKeys = {
	googleMapsAPI : 'maps.googleapis.com here',
};