var express               =    require('express'),
    router                =    express.Router(),
    puppeteer             =    require('puppeteer'),
    flash                 =    require('connect-flash'),
    shuffle               =    require('shuffle-array'),
    user                  =    require('../models/user'),
    questionData          =    require('../models/question'),
    fs                    =    require('fs'),
    pdf                   =    require('html-pdf'),
    phy101                =    require('../models/phy101')

//=====================================
//phy question route
//=====================================

router.get('/physicsquestion/exam',isLoggedIn,(req,res)=>{
    //delete physics data with this user
    phy101.deleteMany({
       studentname: req.user.username,
       department: req.user.department,
       course: "PHY101"
     })
    .then(result => {
       console.log(`${result.deletedCount} documents deleted,${req.user.username}`);
     })
     .catch(error => {
       console.error('Error deleting documents:');
     });
    questionData.find()
    .then(document=>{
      var originalData = [];
      document.forEach((questions)=>{
         if(questions.course==='PHY101'){
            originalData.push(questions);
         }
      });
      const shuffledPhyData = shuffle(originalData);
   if (!req.session.shuffledPhyData) {
      req.session.shuffledPhyData = shuffledPhyData;
    }
        const phy={
          course: 'PHY101'
         };
        phy101.create(phy)
        .then(phy101Created=>{
           for(var i=1; i <= req.session.shuffledPhyData.length; i++){
           phy101Created.question.push(req.session.shuffledPhyData[i]);
        };
          phy101Created.ref_user_id=req.user._id;
          phy101Created.studentname=req.user.username;
          phy101Created.department=req.user.department;
          phy101Created.save();
          res.render('phyExam',{phyExam:  req.session.shuffledPhyData});
        })
        .catch(error=>{
           console.error(error);
        });
   
    })
    .catch(error=>{
      console.error(error);
    });
   });
   //=================================
   //parse phy data for result Route
   //=================================
   router.post('/exam/phy/data/result', isLoggedIn, async (req, res) => {
    try {
      req.session.shuffledBioData = null;
      console.log(req.body, 'phy', req.user.username);
      const filter = {
        studentname: req.user.username,
         course: 'PHY101', // Assuming you want to update a Biology course score
      };
        // Define the update to be applied
      const update =  {
        $set: {
          score: req.body.physcore,
          grade: req.body.phygrade, // Increment the version
        },
      };
      // Optionally, you can specify additional options
      const options = {
        new: true, // Return the updated document after the update
      };
      // Use async/await with Mongoose
      const updatedDocument = await phy101.findOneAndUpdate(filter,update,options);
  
      if (updatedDocument) {
        res.status(200).json({ message: 'Document updated successfully', data: updatedDocument });
      } else {
        res.status(404).json({ error: 'Document not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/exam/phy101/result',isLoggedIn,async (req, res) => {
    console.log(req.user.username + ' phy101 result is being generated');
    
    try {
      // Fetch the student document (replace this with your database logic)
      const document = await phy101.findOne({studentname: req.user.username, course: 'PHY101' });
      
      if (!document || document.department === '') {
        req.flash('error', 'This student has not submitted or did not do the exam, kindly go back to the exam page...........');
        res.redirect('/exam/generate-pdf/result');
        return;
      }
                
     res.render('student_result',{document: document});
  
    } catch (error) {
      console.error('Error:', error);
      req.flash('error', 'An error occurred while processing the request.');
      res.redirect('/exam/instruction');
    }
   });
 
 router.post('/exam/generate-pdf/phy/result', isAdmin, (req, res) => {
    user.find()
      .then(User => {
        let userFound = false;
        User.forEach((users) => {
          if (users.username === req.body.username) {
            userFound = true;
            req.flash('success', 'Student result is being generated....');
            // Generate pdf route
            res.redirect('/exam/phy101/' + users.username + '/result');
          }
        });
  
        // If no matching user found
        if (!userFound) {
          req.flash('error', 'Invalid Student Name....');
          res.redirect('/exam/generate-pdf/result');
        }
      })
      .catch(err => {
        console.error('error founding user.........190');
      });
  });

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
     return next();
    }
    //else the person is not logged in goto login page
   req.flash('error', 'You need to be logged in,login/sign up......');
    res.redirect('/exam/login');
  };
  function isAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.isAdmin){
     return next();
    }
    //else the person is not logged in goto login page
   req.flash('error', 'Sorry,only admins can access this page.....');
    res.redirect('/exam/login');
  };

module.exports=router;