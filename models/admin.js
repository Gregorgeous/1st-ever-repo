var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var _ = require('lodash');

var AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
});

AdminSchema.methods.toJSON = function () {
  var admin = this;
  var adminObject = admin.toObject();

  return _.pick(adminObject, ['_id', 'email']);
};

AdminSchema.methods.generateAuthToken = function () {
  var admin = this;
  var access = "auth";
  var token = jwt.sign({_id: admin._id.toHexString(), access}, "abc123").toString();
// kochamHufiec
  admin.tokens.push({access, token});

  return admin.save().then(() => {
    return token;
  });
}

AdminSchema.statics.checkIfHavingToken = function (token) {
  var Admin = this;
  var access = "auth";

  try {
    var tokensMatch = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return Admin.findOne({
  '_id': tokensMatch._id,
  'tokens.token': token,
  'tokens.access': 'auth'
});
};

AdminSchema.statics.findAdminInDb = function(email, password,done){
  var Admin = this;

  return Admin.findOne({email})
  .then((err, admin) => {
    if (err) {
      console.log("returned error");
    }
    if (!admin) {
      console.log("returned no matching users with database");
      return done(null, false,{ message: 'Incorrect email.'});
    } else {
          bcrypt.compare(password, admin.password, (err, res) => {
            if (res) {
              console.log("all working");
              return done(null, user);
            } else {
              console.log("returned incorrect password");
              return done(null, false,{ message: 'Incorrect password.' });
            }
          });
    }
  })
};

AdminSchema.pre('save',function (next) {
  var admin = this;


  if (admin.isModified('password')) {
    bcrypt.genSalt(10, function(err,salt) {
      bcrypt.hash(admin.password, salt, function (err, hash) {
        admin.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Admin = mongoose.model('Admin', AdminSchema);


module.exports = {Admin}
