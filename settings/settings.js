/** postgres DB */
exports.DBConfig = {
	db : {
		host : "ec2-54-163-225-41.compute-1.amazonaws.com",
		username : "kughvnfekebcsd",
		password : "7jV0LkjZYFJ2_zkwibQ60RQz_O",
		database : "ddeq1i2njbosnl"
	}
};

/** SMTP config, send admin emails to users */
exports.SMTPConfig = {
	mailHost : 'mail.privateemail.com',
	fromAddress : 'admin@shamanic.io',
	sendMailPassword : 'w0nd3r0u$t0ngu3'
};

/** for expressjs app session keys assign them here */
exports.sessionKeys = {
		cookieParserKey : 'zkwibQ60RQz',
		sessionKey: '7jV0LkjZYFJ2'
};