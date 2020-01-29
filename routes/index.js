const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
const uploadCloud = require('../config/cloudinary')
const uploadCloudMedia = require('../config/cloudinary2')
const Pic = require('../models/Pic')
const User = require('../models/User')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/profile', (req, res, next) => {
  if (req.session.googleSessionEdwin) {
    console.log("req.session.googleSessionEdwin::: ")
    console.log(req.session.googleSessionEdwin)
    console.log("EMAIL::: " + req.session.googleSessionEdwin)
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
//////////////////////////Actualizar foto del perfil
router.post('/upload', uploadCloud.single('photo'), async (req, res, next) => {//subir imagen
  const { url, originalname } = req.file
  console.log(">>>>>", url)
  const { caption } = req.body
  const newPic = await Pic.create({ caption, photos: { url, name: originalname } })
  const myquery = { email: req.session.googleSessionEdwin.email };
  const newvalues = { $set: { picture: url } };
  const userUpdatePic = await User.updateOne(myquery, newvalues, (err) => {
    console.log("1 document updated");
  })
  var js1 = req.session.googleSessionEdwin
  var key = "picture";
  delete js1[key];
  js1.picture = url;
  req.session.googleSessionEdwin = js1
  res.redirect("profile");
  //res.render('uploaded-pic', newPic)
})
router.get('/upload', (req, res, next) => {//get /upload y render()upload-pic si se a iniciado session
  if (req.session.googleSessionEdwin) {
    res.render('upload-pic')
  } else {
    //console.log(req)
    res.redirect("/");
  }
})
//////////////////////////Autenticar usuario de Google
router.get('/google/redirect', passport.authenticate('google', { scope: ['email', 'profile'] }),
  (req, res) => {
    req.session.googleSessionEdwin = req.user;
    res.redirect("/profile");
  }
)


//////////////////////////autenticar usuario de Facebook
router.get('/facebook/redirect', passport.authenticate('facebook', { scope: 'email' }), (req, res) => {
  req.session.googleSessionEdwin = req.user;
  console.log("user ::<<<<<<<<<<<:: " + req.user + " ::>>>>>>>>>")
  res.redirect("/profile");
})

//////////////////////////Destruir sessiones 
router.get('/signout', (req, res, next) => {
  console.log(".....Destroy.......................Destroy.................Destroy........................")
  req.session.destroy();
  res.redirect("/");
})

///////////////////////////se registra un nuevo usuario
router.post('/signup', async (req, res, next) => {
  console.log("\n \n <<< singup >> \n \n")
  try {
    var username = req.body.email
    let email = req.body.email
    const dns = require('dns');
    console.log("DNS")
    let domain = email.split('@')[1];
    dns.lookup(domain, async (err, address, family) => {
      if (err) {
        console.log(err)
      }
      else if (address && address.length > 0) {
        console.log("Correcto")
        try {
          console.log("Correcto1s")
          var password = req.body.password
          var passEncriptada = encriptar(username, password)
          console.log("Correcto2")
          const user = await User.insertMany(
            {
              email: req.body.email,
              name: req.body.name,
              lastName: req.body.lastName,
              password: passEncriptada
            })  //{ ...req.body } 
          console.log("Correcto3")
          req.session.googleSessionEdwin = user[0]
          console.log('address: %j family: IPv%s', address, family);
          res.render('profile', req.session.googleSessionEdwin)
        } catch (e) {
          console.log(e)
          res.redirect("/auth/registrar");
        }
      } else {
        res.redirect("/auth/registrar");
        console.log("not exist")
      }

    });

  } catch (e) {
    res.send('User already exists!' + e)
  }
})

//////////////////////////iniciar sesion 
router.post('/login', async (req, res, next) => {
  console.log("iniciar sesion ........")
  try {
    var username = req.body.email
    var password = req.body.password
    const userjs = await User.find({ email: username })//console.log("userj::::::::::"+userjs+"::::::::::") //console.log("userj[0]::::::::::"+userjs[0]+"::::::::::")//console.log("userj[0].name::::::::::"+userjs[0].name+"::::::::::") 
    if (userjs) {// siexiste el usuario
      var passEncriptada = encriptar(username, password)
      if (userjs[0].email == username && userjs[0].password == passEncriptada) {
        req.session.googleSessionEdwin = userjs[0];
        res.render('profile', req.session.googleSessionEdwin)
      }
      else {
        res.send('pass o user error')
      }
    }
    else {//si no existe el usuario
      res.send('pass o user error')
    }
  } catch (e) {
    // res.send('No exist Error ::'+e)
    res.redirect("/auth/entrar");
  }
})
router.get('/reg', (req, res, next) => {//reederea registrar
  res.render('reg')
})
router.get('/entr', (req, res, next) => {//renderea iniciar sesion
  res.render('entr')
})

function encriptar(user, pass) {
  var crypto = require('crypto')
  // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
  var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex')
  return hmac
}
router.get('/req', (req, res, next) => {//renderea iniciar sesion
  console.log(req)
})
router.get('/init', (req, res, next) => {//renderea iniciar sesion
  req.session.googleSessionEdwin = {
    picture: 'http://res.cloudinary.com/dzyssenr4/image/upload/v1580252134/img/arbzp2cswk818emy7qgg.png',
    role: 'GUEST',
    _id: '5e30bbc285328f26c4349958',
    email: 'nada@gmail.com',
    name: 'Edwin',
    lastName: 'Barrio',
    password: 'b47c9b8e4b6324b54283e490d536a75c34bb81ef',
    createdAt: '2020-01-28T22:54:58.080Z',
    updatedAt: '2020-01-28T22:55:36.436Z'
  }
  res.render("mediaUser");
})
///seleccionar image
router.get('/subirImg', (req, res, next) => {//get /upload y render()upload-pic si se a iniciado session
  if (req.session.googleSessionEdwin) {
    res.render('mediaUser')
  } else {
    //console.log(req)
    res.redirect("/");
  }
})
////subir img por user   router.post('/subirImg', uploadCloudMedia.single('photo'),(req, res, next) => {//subir imagen
router.post('/s', async (req, res, next) => {//subir imagen
  //const { url, originalname } = req.file
  //console.log(">>>>>", url)
  try {
    // console.log(">>>>>", req.session.googleSessionEdwin)
    var url = "imagen2.jpg";
    const userjs = await User.find({ email: req.session.googleSessionEdwin.email })
    console.log(userjs)
    console.log(">>>>>")
    var js2 = userjs[0].media[0]
    js2.image3 = url
    console.log(js2)
    console.log(">>>>>")
    const myquery = { email: req.session.googleSessionEdwin.email };
    const images = { image: url }
    const newvalues = { $set: { media: [js2] } };
    const userUpdatePic = await User.updateOne(myquery, newvalues, (err) => {
      console.log("1 document updated");
    })
  } catch (err) {
    console.log(err)
  }

})


const PicUser = require('../models/PicUser')
router.post('/subirImg', uploadCloudMedia.single('photo'), async (req, res, next) => {//subir imagen
  const { url, originalname } = req.file
  console.log(">>>>>", url)
  const { caption } = req.body
  const newPic = await PicUser.create({ caption, photos:url, name: originalname , email: req.session.googleSessionEdwin.email }) 
  res.render('uploaded-pic', newPic)
}
)
router.get('/showphotos', async (req, res, next) => {//subir imagen 
  try { 
    const rs = await PicUser.find({ email:req.session.googleSessionEdwin.email }) 
    var json1=rs[0]
    console.log(json1);
    res.render("fotosUser",rs)
  } catch (err){
    console.log(err)
  }
})
module.exports = router;