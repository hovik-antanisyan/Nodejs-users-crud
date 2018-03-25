const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/users-crud');

const userRoutes = require('./routes/user');

const app = express();

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

//app routes
app.use('/users', userRoutes);
app.use('/', function (req, res, next) {
    app.locals.title = 'Homepage';
    res.render('welcome');
});

app.use('/error', (req, res, next) => {
    const error = new Error('Not found');
    req.status = 404;

    next(error);
});

app.use((error, req, res, next) => {
    res.status(req.status || 500).render('error', {error});
});

module.exports = app;