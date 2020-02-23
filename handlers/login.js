const exp = require('express') ;
const bc = require('bcryptjs') ;

const User = require('../models/User.js') ;
const auth = require('../src/auth.js') ;

const router = new exp.Router() ;

router.post('/login', (req, res) => {
	const {email, password} = req.body ;
	console.log('login requested by '+email)

	let user = {} ;

	User.findByEmail(email, password)
	.then(userr => {
		user = userr ;
		return userr.generateAuthToken() ;
	})
	.then(token => {
		console.log('user login token generated')
		const obj = {token, user} ;
		res.json(obj); 
	})
	.catch(err => res.status(400).json(err) ) ;
}) ;

router.post('/logout', auth, (req, res) => {
	console.log(req.user.name+' requested logout') ;

	req.user.tokens = req.user.tokens.filter( (token) => token.token !== req.token) ;
	req.user.save()
	.then( data => res.json('Successfully logged out') )
	.catch( err => res.status(500).json(err)) ;
}) ;

router.post('/logoutAll', auth, (req, res) => {
	console.log(req.user.name+' requested logout all sessions') ;

	req.user.tokens = [] ;
	req.user.save()
	.then( data => res.json('Successfully logged out') )
	.catch( err => res.status(500).json(err)) ;
}) ;

module.exports = router ;