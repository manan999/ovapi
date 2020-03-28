const mongoose = require('mongoose') ;
const valid = require('validator') ;
const bc = require('bcryptjs') ;
const jwt = require('jsonwebtoken') ;

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		lowercase: true,
		validate(email) {
			if(!valid.isEmail(email))
				throw new Error('Invalid E-Mail Address') ;
		}
	},
	mobile: {
		type: String,
		trim: true,
		validate(mobile) {
			if(!valid.isNumeric(mobile))
				throw new Error('Invalid Mobile Number') ;
			else if (mobile.length < 10 || mobile.length > 14)
				throw new Error('Mobile Number Length incorrect') ;
		}
	},
	password : {
		type: String,
		trim: true,
		required: true,
		minlength: 6,
		validate(password) {
			if( password.includes('password') || password.includes('123'))
				throw new Error('This password may be too common try some other')
		}
	},
	uploads : {
		type: Number,
		default: 0 
	},
	tokens: [{
		token: {
			type: String, 
			required: true 
		}
	}],
	face_detection_history: [{
		link : {
			type: String,
			required: true
		},
		time: {
			type: Date,
			default: Date.now
		},
		data : {}
	}],
	image: {
		type: String,
		trim: true,
	}
}, { 
	timestamps: true
}) ;

UserSchema.statics.findByEmail = async function(email, password){
	const user = await User.findOne( {email} )
	// Same as
	// User.findOne( {email: email})
	if(!user)
		throw new Error("User with this Email does not exist") ;
	else
	{
		const isMatch = bc.compareSync(password, user.password) ;
		if(!isMatch)
			throw new Error("Password does not match") ;
		else
			return user ;
	}
}

UserSchema.methods.generateAuthToken = function(){
	const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET) ;
	this.tokens = this.tokens.concat({ token }) ;
	this.save() ;
	return token ;
}

//Comment this method while debugging
UserSchema.methods.toJSON = function(){
	let obj = this.toObject() ;

	delete obj.password ;
	delete obj.tokens ;
	delete obj.face_detection_history ;

	return obj ;
}

const User = mongoose.model('User', UserSchema) ;

module.exports = User ;