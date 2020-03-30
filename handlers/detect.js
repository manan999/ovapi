const exp = require('express') ;

const User = require('../models/User.js') ;
const auth = require('../src/auth.js') ;

const router = new exp.Router() ;

router.post('/detect/:type', auth, (req, res) => {
	const {name, history} = req.user ;
    const {type} = req.params ;

    console.log(name + ' requested detection save for '+ type) ;

    history[type] = [ ...history[type], req.body ] ;

	req.user.save() 
    .then( data => {
        res.json('Detection history for '+type+' added'); 
    })
    .catch( err => {
    	console.log(err);
    	res.status(500).json(err.message) 
    }) ;
    
}) ;

router.delete('/detect/:type', auth, (req, res) => {
	console.log(req.user.name + ' requested history delete for '+req.params.type) ;
    
    req.user.history[req.params.type] = [] ;
    
    req.user.save()
    .then( () => res.json('History for '+ req.params.type + ' deleted Successfully') )
    .catch( err => res.status(400).json(err.message)) ;
}) ;

router.delete('/history', auth, (req, res) => {
    console.log(req.user.name + ' requsted all history deletion') ;

    req.user.history = {
        face : [],
        color: [],
        general : [] ,
        age : [] ,
    }

    req.user.save()
    .then( () => res.json('History for '+ req.user.name + ' deleted Successfully') )
    .catch( err => res.status(400).json(err.message)) ;
}) ;

module.exports = router ;