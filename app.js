const express = require('express');
const bodyParser = require('body-parser');
const bikeRoutes = require('./routes/bike.route');

// Init app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/bikes', bikeRoutes);

// Export de notre module, afin qu'il puisse etre reutilise
module.exports = app;