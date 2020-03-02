/**
 * Generic helper for sending user's emails
 *
 * @author khinds
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */

// email user a message
exports.emailUser = function(req, address, subject, message) {
	var server = req.emailService.server.connect({
		user : req.appSettings.SMTPConfig.fromAddress,
		password : req.appSettings.SMTPConfig.sendMailPassword,
		host : req.appSettings.SMTPConfig.mailHost,
		ssl : true
	});
	server.send({
		from : req.siteEnvironment.websiteConfig.websiteEmailFromName + " <" + req.appSettings.SMTPConfig.fromAddress + ">",
		to : address,
		subject : subject,
		text : message,
	}, function(err, message) {
		console.log(err || message);
	});
}
