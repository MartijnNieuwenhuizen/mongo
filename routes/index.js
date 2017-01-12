const express = require('express');
const router = express.Router();
const monk = require('monk');

const auth = require('./helpers/auth');

/* GET home page. */
router.get('/', auth.login, function(req, res, next) {
  // Assign meta
  res.locals.meta = Object.assign({}, res.locals.meta, {
    title: 'MongoDB'
  });

  // DB consts
  const db = monk('localhost:27017');
  const collection = db.get('document');
  const test = db.get('testCollection');

  collection.find({})
    .then(data => {

      test.find({})
      .then(testData => {
        console.log('CHECK: testData Found: ');
        res.render('index', { title: 'MongoDB Test', data: data, test: testData });
      })
      .catch(err => { console.log(err); });
    })
    .catch(err => { console.log(err); });
    // .then(() => db.close());
});

// handle the POST from the add form
router.post('/', auth.login, (req, res, next) => {
  const newThing = req.body;
  console.log('CHECK: got a POST');

  // make MongoDB connection
  const db = monk('localhost:27017');
  const collection = db.get('document');
  const test = db.get('testCollection');

  // insert POST into MongoDB
  test.insert(newThing)
    // If insert was succesfull
    .then((check) => {
      console.log('CHECK: Posted');

      // get the normal collection
      collection.find({})
        .then(data => {

          // get the test collection
          test.find({})
          .then(testData => {
            console.log('CHECK: render after post with test data');
            res.render('index', { title: 'MongoDB Test', data: 0, test: testData });
          })
          .catch(err => { console.log(err); });
        })
        .catch(err => { console.log(err); });
    })
    .catch(err => {
      console.log('CHECK: POST didnt work');
      console.log(err);
    });
});

module.exports = router;
