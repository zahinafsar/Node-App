const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req,res,next) {
	const token = req.cookies.token;
	if (!token) return res.send("Access denied");
	try{
		const decode = jwt.verify(token,`${process.env.KEY}`);
		res.user = decode;
		next();
	}
	catch(e){
		res.send(e);
	}
	

}