require('dotenv').config();
var express               =    require('express'),
    app                   =    express(),
    bodyParser            =    require('body-parser'),
    mongoose              =    require('mongoose'),
    methodOverride        =    require('method-override'),
    passport              =    require('passport'),
    fs                    =    require('fs'),
    pdf                   =    require('html-pdf'),
    puppeteer             =    require('puppeteer'),
    localStrategy         =    require('passport-local'),
    passportLocalMongoose =    require('passport-local-mongoose'),
    flash                 =    require('connect-flash'),
    shuffle               =    require('shuffle-array'),
    user                  =    require('./models/user'),
    questionData          =    require('./models/question'),
    bio101                =    require('./models/bio101'),
    mth101                =    require('./models/mth101'),
    chm101                =    require('./models/chm101'),
    gns101                =    require('./models/gns101'),
    phy101                =    require('./models/phy101'),
    adminRegisterRoutes   =    require('./routes/admin_register'),
    bio101Routes          =    require('./routes/bio101'),
    phy101Routes          =    require('./routes/phy101'),
    mth101Routes          =    require('./routes/mth101'),
    gns101Routes          =    require('./routes/gns101'),
    chm101Routes          =    require('./routes/chm101'),
    uploadRoutes          =    require('./routes/upload'),
    userRegisterRoutes    =    require('./routes/user_register')

const PORT=process.env.PORT || 3000;
//Set up default mongoose connection
var url= 'mongodb+srv://VictorAjadi:Pelumi2023@cluster0.66cwqpr.mongodb.net/new_hgbc_test';

// MongoDB connection URL
const mongoDBUrl = url; // Replace with your MongoDB URL

// Mongoose connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Set a 30-second timeout for server selection
};

// Create the MongoDB connection
mongoose.connect(mongoDBUrl, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define your Mongoose schema and models here



app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/assets'));
app.use(methodOverride('_method'));
app.use(flash());

//passport configuration
app.use(require('express-session')({
    secret: 'i really love oluwapelumi in choir',
    resave: false,
    saveUninitialized: false
}));
// Middleware to shuffle and store data in session

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req,res,next)=>{
   res.locals.userLoggedIn=req.user;
   res.locals.error=req.flash('error');
   res.locals.success=req.flash('success');
   next();
 });

app.use(adminRegisterRoutes);
app.use(userRegisterRoutes);
app.use(uploadRoutes);
app.use(bio101Routes);
app.use(chm101Routes);
app.use(gns101Routes);
app.use(mth101Routes);
app.use(phy101Routes);

app.get('/',(req,res)=>{
  res.redirect('/exam/instruction');
});
app.get('/exam/instruction',isLoggedIn,(req,res)=>{
   res.render('examPage');
});

//===================================
//show the download result form page
//===================================
app.get('/exam/generate-pdf/result',isAdmin,(req,res)=>{
   res.render('result');
});
 //========================
//middle-ware
//========================
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

app.listen(PORT,()=>{
    console.log(`HGBC SERVER HAS STARTED AT PORT ${3000}.....`);
});