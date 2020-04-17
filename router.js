const exp = require('express');
const router = exp.Router()
const Account = require('./model');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const auth = require('./auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const schema = Joi.object({
    name: Joi.string().min(3).max(60).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
    email: Joi.string().email().required()
})
const logschema = Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
    email: Joi.string().email().required()
})

router.get("/me",auth, async (req,res)=>{
	 const account = await Account.findById(res.user._id).select("-password");
	 res.render("me",{account});
})

router.get("/", async (req,res)=>{
	try{
		const account = await Account.find();
		res.render("main",{account});
	}catch(err){
		console.log(err)
	}
	
})
router.get("/all", async (req,res)=>{
	try{
		const account = await Account.find();
		res.json(account);
	}catch(err){
		console.log(err)
	}
	
})


router.get('/logout', (req, res) => {
  res.clearCookie('token');
});

router.get("/register",(req,res)=>{
		res.render("register");
})
router.post("/register",(req,res)=>{
	const { error, value } = schema.validate(req.body);
	if (error) {
		return res.status(403).send(error.details[0].message)
	}
	bcrypt.hash( req.body.password ,5,async(err, hash)=>{
		const account  = new Account({
			name : req.body.name,
			email : req.body.email,
	    	password : hash
		})
		const result = await account.save();
		const JWTtoken = account.genToken();
		res.cookie('token',JWTtoken,{maxAge:3600000,httpOnly:true});
		res.redirect("/me")
	})
	
})




router.get("/log",(req,res)=>{
		res.render("log");
})
router.post("/log", async(req,res)=>{
	const { error, value } = logschema.validate(req.body);
	if (error) return res.status(403).send(error.details[0].message);
	const account = await Account.findOne({email : req.body.email});
	if (!account) return res.status(404).send("account not found");
	const valid = await bcrypt.compare(req.body.password,account.password);
	if (!valid) return res.status(404).send("account not found");
	const JWTtoken = account.genToken();
	res.cookie('token',JWTtoken,{maxAge:3600000,httpOnly:true});
	res.redirect("/me")
})


router.delete("/delete/:id", async (req,res)=>{
	try{
		await Account.deleteOne({_id: req.query.id});
	}catch(err){
		console.log(err)
	}
	res.redirect("/");
})
		
module.exports = router;





























// router.post("/reg",(req,res)=>{

// 		const account={
// 			user : req.body.user,
// 	    	password : req.body.password
// 		};
// 		console.log(account);
// 		res.redirect("/reg");
// })




// router.get("/up",(req,res)=>{
// 		res.render("up")
// })
// router.put("/up", (req,res)=>{
// bcrypt.hash( req.query.password ,10,async(err, hash)=>{
// 	try{
// 	const updatedAccount = await Account.updateOne({_id:req.query.id}, {
// 		$set: {
// 		user: req.query.user,
// 		password: hash
// 		},
// 		new: true
// 		});
// 	}catch(err){
// 	console.log(err)
// 	}
// 	res.redirect("/up");
// })

// })


