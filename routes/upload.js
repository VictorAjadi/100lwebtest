var express               =    require('express'),
    router                =    express.Router(),
    flash                 =    require('connect-flash'),
    shuffle               =    require('shuffle-array'),
    questionData          =    require('../models/question')

//==============================
//route for uploading question
//==============================

router.get('/upload/exam/question',isLoggedIn,(req,res)=>{
    res.render('questionGenerate');
  });
  //=================================
  //route for creating question
  //=================================
  router.post('/upload/exam/question',isLoggedIn,(req,res)=>{
  var course= req.body.course;
  var question= req.body.main_question;
  var optionA= req.body.optionA;
  var optionB= req.body.optionB;
  var optionC= req.body.optionC;
  var optionD= req.body.optionD
  var answer= req.body.answer;
  
  var data={
     course: course,
     question: question,
     optionA: optionA,
     optionB: optionB,
     optionC: optionC,
     optionD: optionD,
     answer: answer,
  }
    questionData.create(data)
    .then(questions=>{
      console.log('New ' + questions.course + 'question created');
      req.flash('success','New  '  + questions.course + '  question created....');
      res.redirect('/upload/exam/question');
    })
    .catch(error=>{
     console.error(error);
    })
  });

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
     return next();
    }
    //else the person is not logged in goto login page
   req.flash('error', 'You need to be logged in,login/sign up......');
    res.redirect('/exam/login');
  };

module.exports=router;