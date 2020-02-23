const exp = require('express') ;
const cors = require('cors') ;

require('./src/connect.js') ;
const userHandler = require('./handlers/user.js') ;
const loginHandler = require('./handlers/login.js') ;

const app = exp() ;

app.use(exp.json()) ;
app.use(cors()) ;

app.use(userHandler) ;
app.use(loginHandler) ;

app.get('/', (req, res) => {
	console.log(req.body) ;
	console.log(req.headers) ;
	console.log(req.params) ;
	console.log(req.url) ;
	res.json("Please give the required endpoint for json data") ;
}) ;

app.listen(process.env.PORT || 8080, () => {
	console.log("Server is Online" ) ;
}) ;