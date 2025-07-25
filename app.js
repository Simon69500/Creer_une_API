var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const methodOverride = require('method-override');

// Routes API
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catwaysRouter = require('./routes/catways');
const reservationRouter = require('./routes/reservations');

const mongodb = require('./db/mongo');

mongodb.initClientDbConnection();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/out', express.static(path.join(__dirname, 'out')));
app.use(express.static(path.join(__dirname,'public')))

app.use(cors({
  exposedHeaders: ['Authorization'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  origin: '*'
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/', reservationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
