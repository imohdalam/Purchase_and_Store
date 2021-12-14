var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Prod = require('../models/product');
var rqst = require('../models/checkout');

router.get('/', function (req, res, next) {
	return res.render('home.ejs');
});

router.get('/register', function (req, res, next) {
	return res.render('index.ejs');
});

router.get('/contact', function (req, res, next) {
	return res.render('contact.ejs');
});

router.post('/query', (req, res, next) => {
	res.render("query.ejs");
});

router.post('/register', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.name || !personInfo.Department || !personInfo.Role || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({username:personInfo.username},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data._id + 1;
						}else{
							c=1001;
						}

						var newPerson = new User({
							_id:c,
							name:personInfo.name,
							Department:personInfo.Department,
							Role: personInfo.Role,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({username:req.body.username},function(err,data){
		if(data){
			
			if(data.password==req.body.password && data.Role == req.body.Role){
				//console.log("Done Login");
				req.session.userId = data._id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
			}
			else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not registered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({_id:req.session.userId},function(err,data){
		console.log("login details");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else if (data.Role=="Dean") {
			//console.log("found");
			return res.render('data1.ejs', {"name":data.name, "username":data.username, "Role":data.Role});

		}else if (data.Role=="HOD"){
			//console.log("found");
			return res.render('data2.ejs', {"name":data.name, "username":data.username, "Role":data.Role, "Department":data.Department});

		}else if (data.Role=="Registrar") {
			//console.log("found");
			return res.render('data3.ejs', {"name":data.name, "username":data.username, "Role":data.Role});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/login');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({username:req.body.username},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not registered!"});
		}else{
			// res.send({"Success":"Success!"});
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
			res.send({"Success":"Password does not matched."});
		}
		}
	});
	
});

router.get('/inventory', (req, res) => {
    Prod.find({}).sort({Category:1}).exec (function(err, product) {
        res.render('inventory', {
            Item : product
        });
    });
});

router.get("/checkout", function(req,res){
	User.findOne({_id:req.session.userId},function(err,data){
	res.render('checkout.ejs', {"name":data.name, "username":data.username, "Department":data.Department});
	})	
})

router.post("/checkout", function(req, res){
    
    var c;
    rqst.findOne({}).sort({_id:-1}).exec (function(err, data){
        if (data){
            c = data._id + 1;
        }
        else{
            c=111;
        }
    let newprod = new rqst({
        _id:c,
		full_name: req.body.full_name,
		username: req.body.username,
        Department: req.body.Department,
	    product_name: req.body.product_name,
	    Category: req.body.Category,
	    quantity: req.body.quantity
    });
	newprod.save();
	res.send({"Success":"Your request has been submitted."});
    //res.redirect("/inventory");
    })
})

router.get('/timeline', (req, res) => {
    rqst.find({}).sort({full_name:1}).exec (function(err, data) {		
		res.render('timeline', {
			history : data
		})
	})
})

router.get('/reqlist', function (req, res, next) {
	rqst.find({}).sort({_id:1}).exec (function(err, data) {		
		res.render('reqlist', {
			history : data
		})
	})
});

router.get('/r-inventory', (req, res) => {
    Prod.find({}).sort({Category:1}).exec (function(err, product) {
        res.render('r-inventory', {
            Item : product
        });
    });
});

router.get("/add", function(req,res){
	User.findOne({_id:req.session.userId},function(err,data){
	res.render('add.ejs');
	})	
})

router.post("/add", function(req, res){
    
    var c;
    Prod.findOne({}).sort({_id:-1}).exec (function(err, data){
        if (data){
            c = data._id + 1;
        }
        else{
            c=5001;
        }
    let newprod = new Prod({
        _id:c,
		product_name: req.body.product_name,
		Stock: req.body.Stock,
	    Category: req.body.Category
    });
	newprod.save();
	res.send({"Success":"Product has been added."});
    //res.redirect("/inventory");
    })
})

router.get("/edit", function(req,res){
	User.findOne({_id:req.session.userId},function(err,data){
	res.render('edit.ejs')
	})	
})

router.post('/edit', function(req, res) {
    Prod.findByIdAndUpdate(req.body._id, 
    {product_name:req.body.product_name, Category:req.body.Category, Stock:req.body.Stock,}, function(err, data) {
		if(err){
            console.log(err);
        }
        else if (data._id != req.body._id) {
			res.send({"Success":"Invalid product id"});
		}else{
			console.log("Data updated!");
			res.send({"Success":"Product updated successfully."});
			//res.redirect("/r-inventory");
		}
    });  
});

router.get("/delete", function(req,res){
	User.findOne({_id:req.session.userId},function(err,data){
	res.render('delete.ejs');
	})	
})

router.post('/delete', function(req, res) {
		Prod.findByIdAndDelete(req.body._id,
		{_id:req.body._id}, function(err, data) {
		if(err){
			console.log(err);
		}else{
			res.send({"Success":"Product deleted successfully."});
			console.log("Record deleted! ");//+ data._id); error
		}
	})
});  


router.get("/edit-hod", function(req,res){
	User.findOne({_id:req.session.userId},function(err,data){
	res.render('edit-hod.ejs')
	})	
})

router.post('/edit-hod', function(req, res) {
    rqst.findByIdAndUpdate(req.body._id, 
    {full_name:req.body.full_name, Department:req.body.Department, product_name:req.body.product_name, Category:req.body.Category, quantity:req.body.quantity}, function(err, data) {
		if(err){
            console.log(err);
        }
        else if (data._id != req.body._id) {
			res.send({"Success":"Invalid request id"});
		}else{
			console.log("Request updated!");
			res.send({"Success":"Request updated successfully."});
			//res.redirect("/r-inventory");
		}
    });  
});

router.get("/delete-hod", function(req,res){
	User.findOne({_id:req.session.userId},function(err,data){
	res.render('delete-hod.ejs');
	})	
})

router.post('/delete-hod', function(req, res) {
		rqst.findByIdAndDelete(req.body._id,
		{_id:req.body._id}, function(err, data) {
		if(err){
			console.log(err);
		}else{
			res.send({"Success":"Request deleted successfully."});
			console.log("Record deleted! ");//+ data._id); error
		}
	})
}); 

module.exports = router;