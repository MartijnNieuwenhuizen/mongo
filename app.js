const express       = require('express');
const path          = require('path');
// const favicon       = require('serve-favicon');
const logger        = require('morgan');
// const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const monk          = require('monk');

const index         = require('./routes/index');
const login         = require('./routes/login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
// - session
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'E=MC2'
}));

// Assign temp user data to the res
app.use((req, res, next) => {
  const db = monk('localhost:27017');
  const usersDB = db.get('users');

  usersDB.find({})
    .then(data => {
      console.log('CHECK: Found the DB');
      res.locals.users = data;
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      db.close();
      next();
    });
});

// Check auth
app.use((req, res, next) => {
  // If there's a session and a logedin user
  if (req.session && req.session.userId) {
    const user = res.locals.users.filter( usersD => usersD.userId === req.session.userId);
    res.locals.user = user[0];
    next();
  } else {
    next();
  }
});

// Routes
app.use('/', index);
app.use('/login', login);

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
