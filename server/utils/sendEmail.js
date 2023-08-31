const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.EMAIL_SENDER,
				pass: process.env.PASSWORD_SENDER,
			},
		});

		await transporter.sendMail({
			from: process.env.EMAIL_SENDER,
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
