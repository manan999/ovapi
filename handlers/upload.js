const exp = require('express') ;
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

router.post('/upload/:type', auth, upload.single('upload'), (req, res) => {
	console.log(req.user.name+' requested image upload for '+req.params.type) ;

    sharp(req.file.buffer).resize({ width:300}).png().toBuffer()
    .then( data => {
    	const obj = {
	        Bucket: process.env.AWS_BUCKET_NAME,
	        ContentType: 'image/png' ,
	        Key: 'detection/'+req.params.type+'/'+req.user.name+'/'+req.user.uploads+'.png', 
	        Body: data
	    };

	    s3.upload(obj, function(err, data) {
	        if (err) {
	            throw err;
	        }
	        console.log(`File uploaded successfully. ${data.Location}`);
            req.user.uploaded() ;
	    	return res.json(data.Location) ;
	    });
    })
    .catch( err => {
    	console.log(err);
    	res.status(500).json(err.message) 
    }) ;
    
}, (error, req, res, next) => {
	console.log(error) ;
    res.status(400).json({ error: error.message}) ;
}) ;

module.exports = router ;