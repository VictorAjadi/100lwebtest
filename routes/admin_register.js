var express               =    require('express'),
    router                =    express.Router(),
    user                  =    require('../models/user'),
    passport              =    require('passport'),
    localStrategy         =    require('passport-local'),
    flash                 =    require('connect-flash'),
    shuffle               =    require('shuffle-array'),
    passportLocalMongoose =    require('passport-local-mongoose')

//=======================
//Admin Login Route
//=======================

router.get('/admin/register',isAdmin,(req,res)=>{
    res.render('questionGenerate');
 });
 //Admin register route
 router.post('/admin/register',isAdmin,(req,res)=>{
      user.register(new user({username: req.body.username,isAdmin: true}),req.body.password)
      .then(User=>{
       req.flash('success','Welcome new admin ' + User.username)
          res.redirect('/upload/exam/question');
      })
      .catch(error=>{
         console.error(error);
         req.flash('error',error.message);
         res.redirect('/admin/register');
      });
 });

  function isAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.isAdmin){
     return next();
    }
    //else the person is not logged in goto login page
   req.flash('error', 'Sorry,only admins can access this page.....');
    res.redirect('/exam/login');
  };

module.exports=router;