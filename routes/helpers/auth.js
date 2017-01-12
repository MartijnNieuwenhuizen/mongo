module.exports = {
  login: function(req, res, next) {
    if (req.session && !req.session.userId) {
      // If there's no SessionID (so no logged in user), rederect
      res.redirect('/login');
    } else {
      // Set logedin to true
      res.locals.loggedin = true;

      // Nothing on the hand, just continue
      console.log('CHECK: all good, continue');
      next();
    }
  }
};
