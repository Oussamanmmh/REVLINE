const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('../middlewares/passportSetup');
const { registerUser, confirmUser } = require('../controllers/authController');

const router = express.Router() ;

router.post('/register' , registerUser) ;
router.get('/email-confirmation/:token' ,confirmUser)

router.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)
router.use(passport.initialize())
router.use(passport.session())
router.get('/google',passport.authenticate('google',{scope:['profile','email']}), )
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login'}),(req,res)=>{
    res.json(req.user)
})


module.exports = router  