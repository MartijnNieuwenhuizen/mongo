const express = require('express');
const router = express.Router();
const monk = require('monk');

const auth = require('./helpers/auth');

/* GET home page. */
// router.get('/', auth.login, function(req, res, next) {
router.get('/', auth.login, function(req, res, next) {

  const url = 'localhost:27016';
  const db = monk(url);
  const collection = db.get('document');
  const fakeData = [
  {
      title: 'Part one',
      pages: '121'
    },
    {
      title: 'Part two',
      pages: '101'
    },
    {
      title: 'Part three',
      pages: '120'
    },
  ];

  collection.insert(fakeData)
    .then(data => {
      console.log(data);
      res.render('index', { title: 'MongoDB Test', data: data });
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => db.close());

  db.then(() => {
    console.log('Connected correctly to server');
  });
});

module.exports = router;
