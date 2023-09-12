var express               =    require('express'),
    router                =    express.Router(),
    user                  =    require('../models/user'),
    flash                 =    require('connect-flash'),
    shuffle               =    require('shuffle-array'),
    passport              =    require('passport'),
    localStrategy         =    require('passport-local'),
    passportLocalMongoose =    require('passport-local-mongoose')

//=====================
//User Register Route
//=====================

router.get('/exam/register',(req,res)=>{
    res.render('register');
 });
 router.post('/exam/register',(req,res)=>{
    department=req.body.department;
      user.register(new user({username: req.body.username,isAdmin: false,department: req.body.department}),req.body.password)
      .then(User=>{
       req.flash('success','Welcome new user ' + User.username);
          res.redirect('/exam/login');
      })
      .catch(error=>{
         console.error(error);
         req.flash('error',error.message);
         res.redirect('/exam/register');
      });
 });
 //================
 //User Login Route
 //===============
 router.get('/exam/login',(req,res)=>{
   res.render('login');
 });
 router.post('/exam/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        // Handle error
        return next(err);
      }
  
      if (!user) {
        // Handle failed authentication
        req.flash('error', 'Invalid username or password.');
        return res.redirect('/exam/login');
      }
  
      // Successful authentication
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
  
        req.flash('success', 'Welcome to hgbc cbt exam ' + req.user.username);
        return res.redirect('/exam/instruction');
      });
    })(req, res, next);
  });
  
 //================
 //Logout Route
 //================
 
 router.get('/exam/logout',(req,res)=>{
    req.logout(req.user,err=>{
     if(err){
       return next(err);
     }
     req.session.shuffledBioData = null;
     req.session.shuffledMthData = null;
     req.session.shuffledChmData = null;
     req.session.shuffledPhyData = null;
     req.session.shuffledGnsData = null;
     req.flash('success','You have successfully logged out,thanks for your time');
     res.redirect('/exam/login');
    })
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