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
  if (req.session.googleSessionEdwin) {
    res.render('profile', req.session.googleSessionEdwin)
  } else {
    //console.log(req)
    res.redirect("/");

  }
  /* if (req.user) {
     res.render('profile', req.user)
   } else {
     res.render('index') //'/login'
   } */
});
router.post('/upload', uploadCloud.single('photo'), async (req, res, next) => {
  const { url, originalname } = req.file
  console.log(">>>>>", url)
  const { caption } = req.body
  const newPic = await Pic.create({ caption, photos: { url, name: originalname } })
  console.log("newPics>>>>>>>>< " + newPic)
  res.render('uploaded-pic', newPic)
})
router.get('/upload', (req, res, next) => {
  if (req.session.googleSessionEdwin) {
  res.render('upload-pic')
  }else {
    //console.log(req)
    res.redirect("/");

  }
})
// edition google 
router.get('/google/redirect', passport.authenticate('google', { scope: ['email', 'profile'] }),
  (req, res) => {
    // console.log(req); 
    req.session.googleSessionEdwin = req.user;
    // console.log(req.session)
    console.log("Route::::" + req.route)
    console.log("user ::<<<<<<<<<<<:: " + req.user + " ::>>>>>>>>>")
    console.log(" google id <<<<< :: " + req.user.googleId + " :: >>>")
    //console.log(req + " >>>>>>>>:>>>>:>>>:>");
    //const redirect = req.session.oauth2return || '/profile';
    //delete req.session.oauth2return;
    //res.redirect(redirect);
     res.redirect("/profile"); 
  }
)
/*esto fue cambiado por (req,res ) de arriba en google redirect
(req, res, next) => {
  console.log(`g user >>> ${req.user}`) 
  res.render('profile', req.user)
}*/ 


///end edition google
router.get('/facebook/redirect', passport.authenticate('facebook', { scope: 'email' } ), (req, res) => {
  req.session.googleSessionEdwin = req.user;
  console.log("user ::<<<<<<<<<<<:: " + req.user + " ::>>>>>>>>>")
  res.redirect("/profile"); 
})
  
// 
router.get('/signout', (req, res, next) => {
  // console.log(".....SALIR.......................SALIR.................SALIR........................")
  // console.log(".............inicio de req .........")
  // console.log(req)
  // console.log(">>>>>>>>>>>>>>>>>>")
  console.log(".....Destroy.......................Destroy.................Destroy........................")
  req.session.destroy();
  // console.log(req)
  console.log(">>>>>>>>>>>>>>>>>>")
  // console.log(".....end Destroy.......................end Destroy.................end Destroy........................")
  // console.log("...cookie....")
  //  console.log(req.cookie)
  // console.log(".......") 
  res.redirect("/");
})


router.post('/signup', async (req, res, next) =>{ 
  console.log("\n \n <<< singup >> \n \n")
 try {
    const user = await User.insertMany({ ...req.body }, req.body.password)
    console.log(user + '//////////////////////////') 
    res.render('profile', req.user)
  } catch (e){
    res.send('User already exists!'+e+
    '<br><br><a href="/"><button type="button" class="btn btn-success">Inicio</button></a>' 
    )
  }
}) 

router.post('/login', async (req, res, next) =>{
console.log("iniciar sesion ........") 
try {
const userjs= await User.find({ email: req.body.email, password: req.body.password})
//console.log("userj::::::::::"+userjs+"::::::::::")
//console.log("userj[0]::::::::::"+userjs[0]+"::::::::::")
//console.log("userj[0].name::::::::::"+userjs[0].name+"::::::::::") 
 if(userjs[0].email == req.body.email && userjs[0].password ==  req.body.password ){
  req.session.googleSessionEdwin = userjs[0]; 
  console.log("userj::::::::::"+userjs)
  console.log("userjs[0]::::::::::"+userjs[0])
     console.log("req.session.googleSessionEdwinn:::")
     console.log(req.session.googleSessionEdwin) 
 res.render('profile',req.session.googleSessionEdwin)
 } 
 else{
  res.send('pass o user error')
 } 
} catch (e){
 // res.send('No exist Error ::'+e)
  res.redirect("/auth/entrar");
}
})
router.get('/reg', (req, res, next) => {
res.render('reg')
})
router.get('/entr', (req, res, next) => {
  res.render('entr')
  })

module.exports = router;
