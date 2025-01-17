require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require('express-session') 
const passport = require('passport') 
//process.env.MONGO_SRV
//mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-uc9aw.mongodb.net/test?retryWrites=true&w=majority
mongoose
  .connect(process.env.MONGO_SRV, {useNewUrlParser: true, useUnifiedTopology:true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });
//evitar las advertencias/*
/*
mongoose.set('useNewUrlParser',true)
mongoose.set('useFindAndModify',false)
mongoose.set('useCreateIndex',true) 
*/
//

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

///
app.use(session({
	secret:process.env.SESSION_SECRET ,
	cookie: {
		maxAge: 1000*60*60*24  //24 horas
		},
	resave:true,
  saveUninitialized :  true
}
))
//Passport Setup
app.use(passport.initialize()) 
//passport session setup

app.use(passport.session())

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerPartials(`${__dirname}/views/partials`)


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/authRoutes')
app.use('/auth', authRoutes)

//  
//
module.exports = app;
