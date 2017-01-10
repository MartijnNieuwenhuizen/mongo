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

  const userEmail = req.body.email.toLowerCase();
  const userPass = req.body.password;
  console.log(userEmail);
  console.log(userPass);

  const users = res.locals.users;
  const user = users.filter( machedUser => machedUser.email === userEmail);

  console.log(user);

  // check if there's a match
  if (user.length > 0) {

    if (user[0].pass === userPass) {
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
