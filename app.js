const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const session       = require('express-session');

const index         = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
// - session
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'E=MC2'
}));

// Temp users data
const users = [{
  email: 'martijnnieuwenhuizen@icloud.com',
  pass: 'Wortels16',
  name: {
    first: 'Martijn',
    last: 'Nieuwenhuizen'
  },
  userId: 1,
  collectionId: '65r*8s4qj9x1'
},{
  email: 'test@test.com',
  pass: 'test',
  name: {
    first: 'test',
    last: 'test'
  },
  userId: 2,
  collectionId: 's59f0s=7'
}];

// Check auth
app.use((req, res, next) => {
  // If there's a session and a logedin user
  if (req.session && req.session.userId) {
    const user = users.filter( usersD => usersD.userId === req.session.userId);
    res.locals.user = user[0];
    next();
  } else {
    next();
  }
});

// Routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
