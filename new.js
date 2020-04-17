const exp = require('express');
const router = require('./router');
const app = exp();
const mlab = require('mongoose');
var cookieParser = require('cookie-parser');
require('dotenv').config();


app.use(exp.json());
app.use(exp.urlencoded({extended : false}));
app.use(cookieParser());
app.use("/",router);
app.set('view engine', 'ejs');


mlab.connect(`${process.env.MLAB}`,
	{useNewUrlParser: true,useUnifiedTopology: true},
	()=>console.log("connected with DB"));
app.listen(3000,()=>{
	console.log("server running")
});