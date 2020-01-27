const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
const uploadCloud = require('../config/cloudinary')
const Pic = require('../models/Pic')
const User = require('../models/User')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/profile', (req, res, next) => {
  if(req.session.googleSessionEdwin){
    res.render('profile', req.user)
  }else{
    res.render('index') //'/login'
  }
 /* if (req.user) {
    res.render('profile', req.user)
  } else {
    res.render('index') //'/login'
  } */
});
router.post('/upload', uploadCloud.single('photo'), async (req, res, next) => {
  const { url, originalname } = req.file
  console.log(">>>>>",url)
  const {caption} = req.body
  const newPic = await Pic.create({ caption, photos: { url, name:originalname  } })
  console.log("newPics>>>>>>>>< "+newPic)
  res.render('uploaded-pic', newPic)
})
router.get('/upload', (req, res, next) => {
  res.render('upload-pic')
})  
// edition google 
router.get('/google/redirect', passport.authenticate('google',{ scope:['email','profile']}),
(req, res) => {
  console.log(req); 
  req.session.googleSessionEdwin=req.user;
  console.log(req.session)
  console.log("Route::::"+req.route)
  console.log("user ::<<<<<<<<<<<:: "+req.user+" ::>>>>>>>>>")
  console.log(" google id <<<<< :: "+req.user.googleId+" :: >>>") 
  console.log(req+" >>>>>>>>:>>>>:>>>:>"); 
  const redirect = req.session.oauth2return || '/profile';
  delete req.session.oauth2return;
  res.redirect(redirect);
}
) 
/*esto fue cambiado por (req,res ) de arriba en google redirect
(req, res, next) => {
  console.log(`g user >>> ${req.user}`) 
  res.render('profile', req.user)
}*/ 
// Middleware que expone el perfil del usuario y las URL de inicio / cierre de sesión 
// cualquier plantilla. Están disponibles como `perfil`,` inicio de sesión` y `cierre de sesión`.
function addTemplateVariables (req, res, next) {
  res.locals.profile = req.user;
   res.locals.login = `/auth/login?return=${encodeURIComponent(req.originalUrl)}`;
   res.locals.logout = `/auth/logout?return=${encodeURIComponent(req.originalUrl)}`;
  next();
}
 

///end edition google
router.get('/facebook/redirect', passport.authenticate('facebook', { scope: 'email' }, (req, res, next) => {
  console.log(`fb user >>> ${req.user}`)
  res.render('profile', req.user)
}))

// editado 
/*
router.get('/session',passport.session(), (req, res) => { 
  console.log(req.session) 
 // Cuenta es el nombre que le damos y lo agregamos al object session 
  req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1 
 res.status(200).send(`Hola has visto esta página ${req.session.cuenta}`);  
 if (req.session.loggedin) {
  res.send('Welcome back, ' + req.session.username + '!');
} else {
  res.send('Please login to view this page!');
}
res.end();
}); 
*/
//
router.get('/checar', (req, res, next) => { 
  console.log("..............................INICIO DE CHECAR..................................................")
  console.log(".............req.user.................")
  console.log(req.user) 
  console.log("...........req session..Google session edwin.................")
  console.log(req.session.googleSessionEdwin) 
  console.log(".............req.................") 
  console.log(req)
  console.log("...cookie....")
  console.log(req.cookie)
  console.log(".......")
  console.log("...............FIN DE CHECAR...............")
})
router.get('/salir', (req, res, next) => { 
  console.log(".....SALIR.......................SALIR.................SALIR........................")
  console.log(".............inicio de req .........")
  console.log(req)
  console.log(">>>>>>>>>>>>>>>>>>")
  console.log(".....Destroy.......................Destroy.................Destroy........................")
  req.session.destroy(); 
  console.log(req)
  console.log(">>>>>>>>>>>>>>>>>>")
  console.log(".....end Destroy.......................end Destroy.................end Destroy........................")
  console.log("...cookie....")
  console.log(req.cookie)
  console.log(".......") 
  res.render("index")
}) 
module.exports = router;
