const jwt = require('jsonwebtoken') ;
const User = require('../models/User.js') ;

const auth = (req, res, next) => {
	const token = req.header('Authorization').replace('Bearer ', '') ;
	const decoded = jwt.verify(token, process.env.JWT_SECRET) ;
	User.findOne({ _id : decoded._id, 'tokens.token': token})
	.then( data => {
		if(!data)
			throw new Error() ;
		else
		{	
			req.user = data ;
			req.token = token ;
			next() ;
		}
	})
	.catch(err => res.status(401).json('Unauthorised to make this request')) ;
}

module.exports = auth ;