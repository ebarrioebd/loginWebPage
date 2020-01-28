const router = require('express').Router()
const passport = require('../config/passport')
const nodemailer = require('nodemailer') 
const User = require('../models/User')
// Router prefix : /auth

router.get('/googleLog',(req, res, next) => {
  // Guarde la URL de la página actual del usuario para que la aplicación pueda redirigir de nuevamente
  // después de la autorización
  if (req.query.return) {
    req.session.oauth2return = req.query.return;
  }
  next();
}, 
passport.authenticate('google', { scope: [ 'profile','email' ]})
) 
 


router.get('/facebook', passport.authenticate('facebook', {
  scope: [
    'public_profile'
  ]
}))
// mail send config
router.get('/sendmail', async (req, res, next) => {
  const port = req.app.settings.port || process.env.PORT
  const host = req.protocol + '://' +req.hostname+ (port ==80 || port == 443 ? '' :  port )
  const name = 'Dummy'
  const lastName = 'Doe'
  const html = '<h2 style="color:blue"> Email test </h2>'
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PWD
    }
  })
  const info = await transporter.sendMail({
    from: `yo mero <${process.env.MAIL}>`,
    to : 'ebarrios.ebd@gmail.com',
    subject : 'correo de prueba',
    text : 'que hda',
    html 
  })
  console.log(req.name+"/////////////////////////////////////////////////")
 res.render('/email_success')
})

////logib mngo
router.get('/registrar', async (req, res, next) => {
  console.log("registrar \n.")
  const config = {
    title: 'Sign up!',
    action: '/signup',
    buttonText: 'registrar ',
    register: true
  }
  res.render('auth/form', config)
}) 
router.get('/entrar', async (req, res, next) => {
  console.log("registrar \n.")
  const config = {
    title: 'Login !',
    action: '/login',
    buttonText: 'Login',
    register: false
  }
  res.render('auth/form', config)
}) 

router.get('/req', async (req, res, next) => {
   console.log(req)
})



module.exports = router
/*
*-login
*   *local
*   *social
*singup
*Dashboard
*subir/eliminar archivos
*forgotten password
*2-tep verification
*user administrcion
  *admin
  *user w/upload permission+
  *user w/view permission
*/

