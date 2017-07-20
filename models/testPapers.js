var mongoose = require('mongoose');
var validator = require('validator');
var _ = require('lodash');

var TestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  scoutGroup: {
    type: String,
    require: true
  },
  examinerName: {
    type: String,
    require: true,
    trim:true
  },
  dateOfWriting: {
    type: String,
    require: true
  },
  passResult: {
    type: Boolean,
    require: true
  },
  imageURL: {
    type: String,
    require: true
  },
});

// TestSchema.methods.toJSON = function () {
//   var admin = this;
//   var adminObject = admin.toObject();
//
//   return _.pick(adminObject, ['_id', 'email']);
// };


TestSchema.statics.findAdminInDb = function(email, password,done){
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

var TestPaper = mongoose.model('TestPaper', TestSchema);


module.exports = {TestPaper}
