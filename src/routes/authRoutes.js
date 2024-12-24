const express = require('express');
const passport = require('passport');
const session = require('express-session');
const prisma = require('../../prismaClient')
require('../middlewares/passportSetup');
const { registerUser, confirmUser } = require('../controllers/authController');
const router = express.Router() ;
const {check} = require('express-validator')

const validateEmail = check("email")
    .notEmpty().withMessage("Email is required ")
    .isEmail().withMessage("Please include a valid email address")
    .custom(async (email) => {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (user) {
            throw new Error("Email is already in use");
        }
        return true;
    });
// Password validation
const validatePassword = check("password")
    .notEmpty().withMessage("Password is required ")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")

router.post('/register'  ,[validateEmail , validatePassword],registerUser) ;
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