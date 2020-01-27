const passport = require('passport')
const User = require('../models/User')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const FacebookStrategy = require('passport-facebook')

//passport.use(User.createStrategy())
passport.serializeUser((user, done) => {
  done(null, user.id)
}
)
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      callbackURL: 'https://login-social-edwin.herokuapp.com/google/redirect',
      clientID: process.env.G_CLIENT_ID,
      clientSecret: process.env.G_CLIENT_SECRET,
      profileFields: ['id', 'displayName', 'name', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(`This is the  google profile >>> ${(profile._json.name)}, Email: ${profile._json.email} , Profile: ${profile._raw}`)
      const currentUser = await User.findOne({googleId: profile.id})
      if(currentUser){
        done(null,currentUser)
      } 
      else {
        const newUser = await new User({
          email: profile._json.email,
          googleId: profile.id,
          name: profile._json.first_name,
          lastName:profile._json.last_name
        }).save()
        done(null, newUser)
      }
    }
  )
)
//facebook login

passport.use(
  new FacebookStrategy(
    {
      callbackURL: 'https://login-social-edwin.herokuapp.com/facebook/redirect',
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      profileFields: ['id', 'displayName', 'name', 'email']

    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(`this is profile Facebook  >>> ${profile}`)
      const currentUser = await User.findOne({googleId: profile.id})
      if(currentUser){
        done(null,currentUser)
      } 
      else {
        const newUser = await new User({
          email: profile._json.email,
          googleId: profile.id,
          name: profile._json.first_name,
          lastName:profile._json.last_name
        }).save()
        done(null, newUser)
      }
    }
  )
)
module.exports = passport
