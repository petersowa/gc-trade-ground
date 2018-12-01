const express = require('express');
const app = express();

// const adminRoutes = require('./routes/admin');
// const authRoutes = require('./routes/auth');

const setupExpress = app => {
  const path = require('path');
  const session = require('express-session');
  const MongoDBStore = require('connect-mongodb-session')(session);
  const csrf = require('csurf');
  const flash = require('connect-flash');
  const sessionKey = require('./_private/session-key');
  const bodyParser = require('body-parser');
  const MongoDB_URI = require('./_private/db-config');

  // Setup Mongo DB Sessions with connect-mongodb-session library
  const store = new MongoDBStore({ uri: MongoDB_URI, collection: 'sessions' });
  // Catch  session errors
  store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
  });

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(
    session({
      secret: sessionKey,
      resave: false,
      saveUninitialized: false,
      store: store,
      unset: 'destroy',
    })
  );

  const csrfProtection = csrf({});
  app.use(csrfProtection);
  app.use(flash());
};

const setupRoutes = app => {
  const User = require('./models/user');

  app.use(
    (req, res, next) => {
      if (req.session.user) {
        console.log('logged in', req.session.user.name);
        User.findById(req.session.user._id).then(user => {
          //console.log('found user', user);
          req.user = user;
          next();
        });
      } else {
        console.log('logged out');
        next();
      }
    },
    (req, res, next) => {
      res.locals.isAuth = req.session.isLoggedIn;
      res.locals.csrfToken = req.csrfToken();
      res.locals.userName = req.session.user ? req.session.user.name : '';
      const error = req.flash('error');
      console.log('flash error', error);
      res.locals.error = error[0];
      next();
    }
  );

  // app.use('/admin', guardRoute, adminRoutes);
};

const setupErrorRoutes = app => {
  const { pageNotFound } = require('./controllers/error');

  app.get('/error/:msg', (req, res, next) =>
    res.render('error', { msg: req.params.msg })
  );
  app.use(pageNotFound);
  app.use((error, req, res, next) => {
    res.render('error', { msg: error });
  });
};

const connectDB = () => {
  const mongoose = require('mongoose');
  const MongoDB_URI = require('./_private/db-config');

  //mongoose.set('useNewUrlParser', true);
  //mongoose.set('useFindAndModify', false);
  //mongoose.set('useCreateIndex', true); // need to enable when using index in model

  return mongoose.connect(
    MongoDB_URI,
    { useNewUrlParser: true, useCreateIndex: true }
  );
};

const setupAppRoutes = app => {
  app.get('/test', (req, res, next) => {
    res.render('test');
  });
};

setupExpress(app);
setupRoutes(app);
setupAppRoutes(app);
setupErrorRoutes(app);
connectDB()
  .then(client => {
    console.log('connected to db');
    app.listen(3100);
  })
  .catch(err => console.log('unable to connect via mongoose', err));
