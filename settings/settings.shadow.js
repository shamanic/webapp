/*
 * SHADOW FILE 
 * 		(please create your own personal 'settings.js' file with your own values from the template below)
 * 
 * 		WARNING: 
 * 				Never commit your own 'settings.js' to GIT, it's a public repo and you'll give away your passwords :) 
 */

/** postgres DB */
exports.DBConfig = {
	db : {
		host : "localhost",
		username : "shamanic_user",
		password : "password here",
		database : "shamanic"
	}
}

/** SMTP config, send admin emails to users */
exports.SMTPConfig = {
	mailHost : 'mail.privateemail.com',
	fromAddress : 'admin@shamanic.io',
	sendMailPassword : 'mail host password here'
}