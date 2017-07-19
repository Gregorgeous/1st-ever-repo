const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const hbs = require('hbs');
const mongoose = require('mongoose');
var path = require('path');
const router = express.Router();


var {Admin} = require('./../models/admin');
var {Authenticate} = require('./../middleware/Authenticate');

router.use(express.static(path.join(__dirname, 'public' )));

// Homepage dir for now redirects to login. TODO: make it redirecting to login unless user not logged in, otherwise create dashboard welcoming admin.
router.get('/', (req, res) => {
  res.redirect('/login');
});

var loginErrors;
router.get('/register', (req, res) => {
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



// redirect('/newtest')

// router.post('/register', (req, res) => {
//   var body = _.pick(req.body, ['email','password']);
//   var admin = new Admin(body);
//
// });


router.get('/login', (req, res) => {
  res.render('Index.hbs', {
    RegisterATagActiveOrNot: '',
    RegisterATagBorW:'',
    LoginATagActiveOrNot: 'bg-danger rounded-circle',
    LoginATagBorW:'text-white',
    GuestATagactiveOrNot: '',
    GuestATagBorW:'',
  });
});

// router.post('/admins/login',
// passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true }),
// (req, res) => {
//   var body = _.pick(req.body, ['email','password']);
//
//   Admin.findAdminInDb(body.email,body.password)
//   .then((admin) => {
//     res.send("you logged in");
//   }).catch((e) => {
//     res.status('400').send('error!');
//   });
// });

router.get('/guest', (req, res) => {
  res.render('Guest.hbs', {
    RegisterATagActiveOrNot: '',
    RegisterATagBorW:'',
    LoginATagActiveOrNot: '',
    LoginATagBorW:'',
    GuestATagactiveOrNot: 'bg-danger rounded-circle',
    GuestATagBorW:'text-white',
  });
});



// --rest of routes (not very imp.) --
router.get('/newtest', (req, res) => {
  res.render('NewTest.hbs');
});

router.get('/database', (req, res) => {
  res.render('DataBase.hbs');
});

module.exports = router;
