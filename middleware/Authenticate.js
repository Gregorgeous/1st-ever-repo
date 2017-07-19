var {Admin} = require('./../models/admin');

var Authenticate = (req, res, next) => {
  var authToken = req.header('x-auth');
  Admin.checkIfHavingToken(authToken)
  .then((adminAuthenticated) =>{
    if(!adminAuthenticated){
      return res.status(401).render('userNotLogged.hbs',{
        'err_msg_header1':'Admin not in the database',
        'err_msg_body1': 'There is no such admin in the database, please register first'
      });
    }
    req.admin = adminAuthenticated;
    req.token = authToken;
    console.log('all works');
    next();
  })
  .catch((e) => {
    console.log('something messed up');
    res.status(401).render('userNotLogged.hbs',{
      'err_msg_header1':'USER NOT LOGGED IN',
      'err_msg_body1': 'This area is only for logged in members, please log in to continue'
    });
  });
};

module.exports = {Authenticate};
