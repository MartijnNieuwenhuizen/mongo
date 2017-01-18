const express = require('express');
const router = express.Router();
const monk = require('monk');

const auth = require('./helpers/auth');

router.get('/', auth.login, (req, res, next) => {
  // Assign meta
  res.locals.meta = Object.assign({}, res.locals.meta, {
    title: 'Edit a thing'
  });

  const thingId = req.query.id;

  // Get the post with the same id from MongoDB
  const db = monk('localhost:27017');
  const things = db.get('things');

  things.findOne({_id: thingId})
    .then(data => {
      console.log(data);
      res.render('thing', { data: data });
    })
    .catch(err => { console.log(err); })
    .then(() => db.close());

});

router.post('/', auth.login, (req, res, next) => {
  console.log('CHECK: got a POST in "/thing"');

  const newThing = req.body;
  const thingId = req.query.id;

  // make MongoDB connection
  const db = monk('localhost:27017');
  const things = db.get('things');

  // Edit POST in MongoDB
  things.findOneAndUpdate({_id: thingId}, newThing)
    .then((updatedThing) => {
      res.redirect('/');
    })
    .catch(err => { console.log(err); });
});

module.exports = router;
