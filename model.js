const mlab = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const accountShema = new mlab.Schema({
	name: {type: String, required: true, lowercase: true},
	email: {type: String, required: true, lowercase: true,uinque:true},
	password: {type: String, required: true}
})

accountShema.methods.genToken=function() {
const token = jwt.sign({_id :this._id},`${process.env.KEY}`);
return token;
}

const Account = mlab.model('newAccount',accountShema);


module.exports = Account;