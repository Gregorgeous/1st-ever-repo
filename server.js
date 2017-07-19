var express = require('express');
const expressValidator = require('express-validator');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const hbs = require('hbs');
const mongoose = require('mongoose');
var path = require('path');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
const moment = require('moment');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// local modules
var {Admin} = require('./models/admin');
var {TestPaper} = require('./models/testPapers');
// setting up mongoose connection
var port = process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost:27017/KSIWebsite';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

var app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public' )));
app.use(bodyParser.json());
app.use(cookieParser('PawelToSpokoGoscAleBanNaWyjazdySpozaZHPToNiepotrzebnaWojna'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'PawelToSpokoGoscAleBanNaWyjazdySpozaZHPToNiepotrzebnaWojna',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));
app.use(flash());
app.use(expressValidator());

// passport middleware - needs to be after parsers and sessions midds
app.use(passport.initialize());
app.use(passport.session());
// Passport middleware below is handling all the authentication
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField : 'password',
  passReqToCallback : true
  },
  function(req,email, password, done) {
    Admin.findOne({email})
    .then((admin) => {
      console.log("tu jestem");
      if (!admin) {
        console.log("returned incorrect user");
        return done(null, false, req.flash('message','takiego maila nie ma w bazie danych' ));
      }
        bcrypt.compare(password, admin.password, (err, res) => {
          if (res) {
            return done(null, admin);
          }
            console.log("returned incorrect password");
            return done(null, false,req.flash('message','Niepoprawne haslo' ));

        });
    }).catch((err) => {
      console.log('error!');
      return done(err);
    });
  }
));
//Below we hand in the authorized data to cookies mechanism (idea simplified)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  Admin.findById(id, function(err, user) {
    done(err, user);
  });
});

// Finally, we want to check if are logged in on the restricted-acces pages
var checkIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else{
     res.render("userNotLogged.hbs", {
       err_msg_header1: 'Dostęp tylko dla zalogowanych użytkownikow',
       err_msg_body1: `Zaloguj się do systemu klikając w zakladkę powyżej`
     });
  }
};

// Set viewing engine for template engine
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// ROUTES section: -----------------------

// Homepage dir for now redirects to login. TODO: make it redirecting to login unless user not logged in, otherwise create dashboard welcoming admin.
app.get('/', (req, res) => {


  res.redirect('/login');
});

var loginErrors;
app.get('/register', (req, res) => {
  if (loginErrors){
    res.render('Register.hbs', {
      RegisterATagActiveOrNot: 'bg-danger rounded-circle',
      RegisterATagBorW:'text-white',
      LoginATagActiveOrNot: '',
      LoginATagBorW:'',
      GuestATagactiveOrNot: '',
      GuestATagBorW:'',
      LoginError:'yes'
    });
  } else {
    res.render('Register.hbs', {
      RegisterATagActiveOrNot: 'bg-danger rounded-circle',
      RegisterATagBorW:'text-white',
      LoginATagActiveOrNot: '',
      LoginATagBorW:'',
      GuestATagactiveOrNot: '',
      GuestATagBorW:''
    });
  }
});

app.post('/admins/register', (req, res) => {

  //Checking if user has filled in the forms correctly:
  // req.checkBody('email', 'Email is required').notEmpty();
	// req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username','proszę wpisac imię').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    loginErrors = errors;
    res.redirect('/register');
  } else {
    loginErrors=undefined;
    var body = _.pick(req.body, ['email','password']);
    var admin = new Admin(body);
    admin.save().then(() => {
    res.redirect('/login');
  }).catch((e) => {
   res.status(400).send(`Error while saving new admin model instance, here's the error: \n ${e}`);
  })
}

});

app.get('/login', (req, res) => {
  res.render('Index.hbs', {
    RegisterATagActiveOrNot: '',
    RegisterATagBorW:'',
    LoginATagActiveOrNot: 'bg-danger rounded-circle',
    LoginATagBorW:'text-white',
    GuestATagactiveOrNot: '',
    GuestATagBorW:'',
    flashMessage: req.flash('message')
  });
});

app.post('/admins/login',
passport.authenticate('local', {
  successRedirect: '/newtest',
  failureRedirect: '/login',
  failureFlash: true}),
(req, res) => {});

app.get('/guest', (req, res) => {
  res.render('Guest.hbs', {
    RegisterATagActiveOrNot: '',
    RegisterATagBorW:'',
    LoginATagActiveOrNot: '',
    LoginATagBorW:'',
    GuestATagactiveOrNot: 'bg-danger rounded-circle',
    GuestATagBorW:'text-white',
  });
});

// --RESTRICTED-ACCESS routes section ----
app.get('/newtest', checkIfLoggedIn, (req, res) => {
  var date = moment().format('YYYY-MM-DD');
  // console.log(date);
  res.render('NewTest.hbs',{
    date: date,
    needsLogOutBtn: true});
});


// Adding new or editing existing resources in testPapers db:
app.post('/database/testPapers/add', (req, res) => {
var body = _.pick(req.body, [
  'name','scoutGroup',
  'examinerName','dateOfWriting',
  'passResult','imageURL',
]);
 var testPaper = new TestPaper(body);
 var addTestStatus;
 testPaper.save().then((test) =>{
  addTestStatus = req.flash('testAdded','Sukces! Test dodany do bazy danych');
   console.log(`Najpierw sprawdz co sie zapisalo: ${test}`);
   console.log(`Teraz sprawdz jaka wartosc flasha:
     ${req.flash('testAdded')}`);
   res.redirect('/database');
 }).catch((err) => {
   addTestStatus = req.flash('testNotAdded','Blad przy dodawaniu testu, sprobuj jeszcze raz');
   res.status(400).redirect('/database');
 });
});

app.get('/database',checkIfLoggedIn,(req, res) => {
  res.render('DataBase.hbs', {
    needsLogOutBtn: true,
    testAddSucces: 'popup dziala, req.flash nie :( ',
    testAddFailure: req.flash('testNotAdded')
  });
});
// route for when you click in test to edit it on DB page
app.get('/database/testPapers/:_id', (req, res) => {
 res.send("TODO");
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// -- finally --- :
app.listen(port, () => {
  console.log("server is running");
});
