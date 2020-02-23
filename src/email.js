const sg = require('@sendgrid/mail') ;

sg.setApiKey(process.env.API_KEY) ;

const sendWelcomeMail = (name, email) => {
	sg.send({
		to: email,
		from: 'noreply@omnvision.web.app',
		subject: 'Welcome to Omnivision App!',
		text: `Hello ${name}, I hope you like this App. Enjoy!`
	}) ;
}

const sendGoodbyeMail = (name, email) => {
	sg.send({
		to: email,
		from: 'noreply@omnvision.web.app',
		subject: 'Sorry to see you go!',
		text: `Hello ${name}, Sorry to hear that you deleted your account with us.
				We are sorry we could not meet the expectations you had. Please give us your valuable
				feedback so that we can improve.`
	}) ;
}

module.exports = {
	sendWelcomeMail, sendGoodbyeMail 
}