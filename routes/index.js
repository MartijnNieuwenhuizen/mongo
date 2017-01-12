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
  const things = db.get('things');

  things.find({})
    .then(data => {
      res.render('index', { thingsData: data });
    })
    .catch(err => { console.log(err); })
    .then(() => db.close());
});




// handle the POST from the add form
router.post('/', auth.login, (req, res, next) => {
  console.log('CHECK: got a POST');

  const newThing = req.body;

  // make MongoDB connection
  const db = monk('localhost:27017');
  const things = db.get('things');

  // insert POST into MongoDB
  things.insert(newThing)
    // If insert was succesfull

    .then((newThingsData) => {
      console.log('CHECK: Posted');

      things.find({})
        .then(data => { res.render('index', { thingsData: data }); })
        .catch(err => { console.log(err); })
        .then(() => db.close());
    })
    .catch(err => { console.log('CHECK: POST didnt work: ', err); });
});

module.exports = router;
