var express               =    require('express'),
    router                =    express.Router(),
    flash                 =    require('connect-flash'),
    shuffle               =    require('shuffle-array'),
    puppeteer             =    require('puppeteer'),
    user                  =    require('../models/user'),
    questionData          =    require('../models/question'),
    bio101                =    require('../models/bio101')

//=====================================
//biology question route
//=====================================
router.get('/biologyquestion/exam',isLoggedIn,(req,res)=>{
    //delete bio data with this user
    bio101.deleteMany({
       studentname: req.user.username,
       department: req.user.department,
       course: "BIO101"
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
       if(questions.course=='BIO101'){
          originalData.push(questions);
       };
    });
    const shuffledBioData = shuffle(originalData);
 if (!req.session.shuffledBioData) {
    req.session.shuffledBioData = shuffledBioData;
  }
      var bio={
        course: 'BIO101'
       };
      bio101.create(bio)
      .then(bio101Created=>{
         for(var i=1; i <= req.session.shuffledBioData.length; i++){
         bio101Created.question.push(req.session.shuffledBioData[i]);
      };
         bio101Created.ref_user_id=req.user._id;
         bio101Created.studentname=req.user.username;
         bio101Created.department=req.user.department;
         bio101Created.save();
        res.render('bioExam',{bioExam:  req.session.shuffledBioData});
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
 //Result Route
 //=================================
 router.post('/exam/bio/data/result', isLoggedIn, async (req, res) => {
  try {
    req.session.shuffledBioData = null;
    console.log(req.body, 'bio', req.user.username);
    const filter = {
      studentname: req.user.username,
       course: 'BIO101', // Assuming you want to update a Biology course score
    };
      // Define the update to be applied
    const update =  {
      $set: {
        score: req.body.bioscore,
        grade: req.body.biograde, // Increment the version
      },
    };
    // Optionally, you can specify additional options
    const options = {
      new: true, // Return the updated document after the update
    };
    // Use async/await with Mongoose
    const updatedDocument = await bio101.findOneAndUpdate(filter,update,options);

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

 router.get('/exam/bio101/:name/result',isAdmin,(req,res)=>{
    console.log(req.params.name + ' bio101 result is being generated');
          bio101.findOne({studentname: req.params.name, course: 'BIO101'})
          .then((document)=>{
            if(document.department===''){
              req.flash('error','This student has not submitted or did not do the exam,kindly go back to exam page...........')
              res.redirect('/exam/generate-pdf/result')
            }else{
              (async () => {
                const browser = await puppeteer.launch(); // Specify headless: 'new'
                const page = await browser.newPage();
              
                // Set the HTML content
                const content = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                  </head>
                  <body>
                  <style>
                     .text-center{
                      text-align: center;
                     }
                     .container{
                      margin: 25%,25%;
                      height: 50%;
                     }
                     .logo-sizing2{
                      height: 60px;
                      width: 60px;
                      margin-left: 50%;
                    }
                  </style>
                  <div class="container">
                  <img src="https://hgbcogbomoso.org/wp-content/uploads/2019/12/logosmall.png" class="  logo-sizing2" alt="">
                  <br>
                  <h1 class="text-center"><b>STUDENT  RESULT</b></h1>
                  <hr>
                  <div class="text-center">
                  <h3 class=""><b>Student Name</b> : <span>${req.params.name}</span></h3>
                  <h3 class=""><b>Department</b> : <span>${document.department}</span></h3>
                  <h3 class=""><b>Course</b> : <span>${document.course}</span></h3>
                  <h3 class=""><b>Score</b> : ${document.score} <span>/ 30</span></h3>
                  <h3 class=""><b>Percentage</b> : ${(Math.round(((document.score)/30)*100))}<span>%</span></h3>
                  <h3 class=""><b>Grade</b> : ${document.grade}</h3>
                  </div>
                  <hr>
                  <br>
              </div>
                  </body>
                  </html>
                `;
              
                await page.setContent(content);
              
                // Generate PDF
                const pdf = await page.pdf();
              
                // Close the browser
                await browser.close();
              
                // Serve the PDF as a response
                res.setHeader('Content-Disposition', `attachment; filename="${req.params.name}-bio101-result.pdf"`);
                res.setHeader('Content-Type', 'application/pdf');
                res.end(pdf);
              })();
            }
          })
            .catch(error=>{
              req.flash('error','This student has not submitted or did not do the exam,kindly go back to exam page...........')
              res.redirect('/exam/generate-pdf/result')
            })  
 });
 router.post('/exam/generate-pdf/bio/result', isAdmin, (req, res) => {
    user.find()
      .then(User => {
        let userFound = false;
        User.forEach((users) => {
          if (users.username === req.body.username) {
            userFound = true;
            req.flash('success', 'Student result is being generated....');
            // Generate pdf route
            res.redirect('/exam/bio101/' + users.username + '/result');
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