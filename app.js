'use strict';
// load modules
const express = require('express');
const morgan = require('morgan');
//import router file
const indexRouter = require('./routes/index');
//import sequelize
const Sequelize = require('./models/index.js').sequelize;
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use('/api', indexRouter);

(async () => {
  //sync the model with the database
  await Sequelize.sync({
  });
  try {
    //used authenticate() method to connect asynchronously to the database
    await Sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connection to the database: ', error);
  }
})();



// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});


module.exports = app;