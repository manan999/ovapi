const exp = require('express') ;
const bc = require('bcryptjs') ;
const multer = require('multer') ;
const sharp = require('sharp') ;
const aws = require('aws-sdk') ;

const User = require('../models/User.js') ;
const auth = require('../src/auth.js') ;

const router = new exp.Router() ;

//multer configuartion object
const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter( req, file, cb){
        if(file.originalname.endsWith('.jpg') || file.originalname.endsWith('.jpeg') || file.originalname.endsWith('.png'))
            cb(undefined, true) ;            
        else
            cb(new Error('File Uploaded is not an Image'))
    }
})

//aws s3 configuration object
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

//UPLOAD END_POINTS
router.post('/users/me/upload', auth, upload.single('upload'), (req, res) => {
	console.log(req.user.name + ' requested profile image upload') ;

    sharp(req.file.buffer).resize({ width:300, height: 300}).png().toBuffer()
    .then( data => {
    	let url = '' ;
    	
    	const obj = {
	        Bucket: process.env.AWS_BUCKET_NAME,
	        ContentType: 'image/png' ,
	        Key: 'userimages/'+req.user.name+'-profile.png', 
	        Body: data
	    };

	    s3.upload(obj, function(err, data) {
	        if (err) {
	            throw err;
	        }
	        console.log(`File uploaded successfully. ${data.Location}`);
	        url = data.location ;
	    });

	    req.user.image = url ;
	    return req.user.save() ;
    })
    .then( () => res.json("Profile Image Uploaded Successfully") )
    .catch( err => {
    	console.log(err);
    	res.status(500).json(err.message) 
    }) ;
    
}, (error, req, res, next) => {
	console.log(error) ;
    res.status(400).json({ error: error.message}) ;
}) ;

router.delete('/users/me/upload', auth, (req, res) => {
	console.log(req.user.name + ' requested profile image upload') ;
    
    req.user.image = undefined ;
    
    req.user.save()
    .then( () => res.json("Image Deleted Successfully") )
    .catch( err => res.status(400).json(err)) ;
}) ;

module.exports = router ;