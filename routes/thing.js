const express = require('express');
const router = express.Router();
const monk = require('monk');

const auth = require('./helpers/auth');

/* GET home page. */
router.get('/', auth.login, function(req, res, next) {
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
      res.render('thing', { data: data });
    })
    .catch(err => { console.log(err); })
    .then(() => db.close());

});

module.exports = router;
