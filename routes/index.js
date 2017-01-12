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
  const test = db.get('testCollection');

  collection.find({})
    .then(data => {

      test.find({})
      .then(testData => {
        console.log('CHECK: testData Found: ');
        console.log(testData);
        res.render('index', { title: 'MongoDB Test', data: data, test: testData });
      })
      .catch(() => {
        console.log('CHECK: No testData Found');
        res.render('index', { title: 'MongoDB Test', data: data, test: 0 });
      });
    })
    .catch(err => {
      console.log(err);
    })
    // .then(() => db.close());
});

// handle the POST from the add form
router.post('/', auth.login, (req, res, next) => {
  // const newThing = req.body;
  console.log('CHECK: got a POST');

  // make MongoDB connection
  const db = monk('localhost:27017');
  const collection = db.get('document');
  const test = db.get('testCollection');

  test.insert({
    thing: req.body.thing,
    type: req.body.type
  })
    .then((check) => {
      console.log('CHECK: Posted');
      console.log(check);

      test.find({})
      .then(testData => {
        console.log('CHECK: render after post with test data');
        console.log(testData);
        res.render('index', { title: 'MongoDB Test', data: 0, test: testData });
      })
      .catch(() => {
        console.log('CHECK: render after post without test data');
        res.render('index', { title: 'MongoDB Test', data: 0, test: 0 });
      });

      // collection.find({})
      //   .then(data => {
      //
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   })
      //   .then(() => db.close());
    })
    .catch(err => {
      console.log('CHECK: POST didnt work');
      console.log(err);
    });
});

module.exports = router;
