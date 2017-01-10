module.exports = {
  login: function(req, res, next) {
    if (req.session && !req.session.userId) {
      // If there's no SessionID (so no logged in user), rederect
      res.redirect('/login');
    } else {
      // Nothing on the hand, just continue
      next();
    }
  }
};
