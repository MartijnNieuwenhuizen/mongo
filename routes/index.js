const express = require('express');
const router = express.Router();
const monk = require('monk');

const auth = require('./helpers/auth');

/* GET home page. */
router.get('/', auth.login, function(req, res, next) {
  res.locals.meta = Object.assign({}, res.locals.meta, {
    title: 'MongoDB'
  });

  const url = 'localhost:27017';
  const db = monk(url);
  const collection = db.get('document');

  collection.find({})
    .then(data => {
      res.render('index', { title: 'MongoDB Test', data: data });
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => db.close());
});

module.exports = router;
