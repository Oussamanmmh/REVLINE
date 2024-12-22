const express = require('express');
const { registerUser, confirmUser } = require('../controllers/authController');

const router = express.Router() ;



router.post('/register' , registerUser) ;
router.get('/email-confirmation/:token' ,confirmUser)


module.exports = router  