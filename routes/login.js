var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  const content = {
    title: 'MongoDB Test',
    err: ''
  };

  res.render('login', content);
});

router.post('/', (req, res, next) => {
  // Data got from post
  const userEmail = req.body.email.toLowerCase();
  const userPass = req.body.password;

  // match the user
  const users = res.locals.users;
  const user = users.filter( machedUser => machedUser.email === userEmail);

  // check if there's a match
  if (user.length > 0) {
    // If the password matches this user
    if (user[0].pass === userPass) {
      // set a session
      const session = req.session;
      session.view = 1;
      session.userId = user[0].userId;

      res.redirect('/');
    } else {
      // User email and password don't match
      const content = {
        title: 'MongoDB Test',
        err: 'email and password doesnt match'
      };

      res.render('login', content);
    }
  } else {
    // User email doesn't exists yet
    res.redirect('/users/sign-up');
  }
});

module.exports = router;
