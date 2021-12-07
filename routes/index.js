var express = require('express');
var router = express.Router();
var User = require('../models/user');
//var popup = require('popups');
//import swal from 'sweetalert';
var username="";


class AuthController{
	constructor(){}
	indexGet (req, res, next) {
		return res.render('index.ejs');
	}
	async usersGet(req, res, next) {
		const result = await User.find({ });
		console.log(result);
		return res.send(result);
	}
	indexPost(req, res, next) {
		console.log(req.body);
		var personInfo = req.body;
		if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
			res.send();
		} else {
			if (personInfo.password == personInfo.passwordConf) {
				User.findOne({email:personInfo.email},function(err,data){
					if(!data){
						var c;
						User.findOne({},function(err,data){
							if (data) {
								console.log("if");
								c = data.unique_id + 1;
							}else{
								c=1;
							}
							var newPerson = new User({
								unique_id:c,
								email:personInfo.email,
								username: personInfo.username,
								password: personInfo.password,
								passwordConf: personInfo.passwordConf
							});
							newPerson.save(function(err, Person){
								if(err)
									console.log(err);
							});
						}).sort({_id: -1}).limit(1);
						res.render("/");
					}else{
						res.send({"Success":"Email is already used."});
					}
				});
			} else {
				res.send({"Success":"password is not matched"});
			}
		}
	}
	loginPost(req, res, next) {
		User.findOne({email:req.body.email},function(err,data){
			if(data){
				if(data.password==req.body.password){
					req.session.userId = data.unique_id;
					//console.log(req.session.userId);
					username=req.body.username;
					res.redirect('/prescription');
				}else{
					res.send({"Success":"Incorrect password"});
					
				}
			}else{
				res.send({"Success":"This Email Is not regestered!"});
			}
		});
	}
	loginGet (req, res, next) {
		return res.render('login.ejs');
	}
	prescription (req, res, next) {
		console.log("data");
		User.findOne({unique_id:req.session.userId},function(err,data){
			console.log("data");
			console.log(data);
			if(!data){
				res.redirect('/');
			}else{
				return res.render('data.ejs', {"name":data.username,"email":data.email});
			}
		});
	}
	logout (req, res, next) {
		console.log("logout")
		if (req.session) {
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
	}
	forgetPassGet (req, res, next) {
		res.render("forget.ejs");
	}
	forgetPassPost (req, res, next) {
		User.findOne({email:req.body.email},function(err,data){
			console.log(data);
			if(!data){
				res.send({"Success":"This Email Is not regestered!"});
			}else{
				if (req.body.password==req.body.passwordConf) {
				data.password=req.body.password;
				data.passwordConf=req.body.passwordConf;
	
				data.save(function(err, Person){
					if(err)
						console.log(err);
					else
						console.log('Success');
						res.send({"Success":"Password changed!"});
				});
			}else{
				res.send({"Success":"Password does not matched! Both Password should be same."});
			}
			}
		});
	}
	instructions(req, res, next){
		res.render("instructions.ejs",{"name":username});
		// User.findOne({email:req.body.email},function(err,data){
		// 	console.log(data);
		// 	if(!data){
		// 		res.send({"Success":"This Email Is not regestered!"});
		// 	}else{
		// 		res.render("instructions.ejs",{"name":username});
		// 	}
		// });
	}
}

const AuthCtrl = new AuthController();

router.get('/', AuthCtrl.indexGet);
router.get('/users', AuthCtrl.usersGet);
router.post('/', AuthCtrl.indexPost);

router.post('/', AuthCtrl.indexPost);

router.get('/login', AuthCtrl.loginGet);

router.post('/login', AuthCtrl.loginPost);

router.get('/prescription', AuthCtrl.prescription);

router.get('/logout', AuthCtrl.logout);

router.get('/forgetpass', AuthCtrl.forgetPassGet);

router.post('/forgetpass', AuthCtrl.forgetPassPost);

router.get('/instructions', AuthCtrl.instructions)

module.exports = router;