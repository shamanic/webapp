/** postgres DB */
exports.DBConfig = {
	db : {
		host : "localhost",
		username : "shamanic_user",
		password : "password",
		database : "shamanic"
	}
}

/** SMTP config, send admin emails to users */
exports.SMTPConfig = {
	mailHost : 'mail.privateemail.com',
	fromAddress : 'admin@shamanic.io',
	sendMailPassword : 'w0nd3r0u$t0ngu3'
}