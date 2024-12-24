const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../prismaClient');
const { validationResult } = require('express-validator');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { isValideUserName, isValideEmail } = require('../utils/validations');
const generateUserName = require('../utils/generUserName');
const sendConfirmationEmail = require('../utils/confirmEmail');

// Register user
exports.registerUser = async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'failed',
            message: 'Validation Error',
            errors: errors.array().map(error => {return {message :error.msg}})
        });
    }
    // Destructure the request body
    const {
        firstName,
        lastName,
        userName,
        email,
        password,
    } = req.body;
    let genUserName ;
    let user ;
    try {
        if(userName){
              await isValideUserName(userName);}
        else{
              genUserName = await generateUserName(firstName, lastName);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                userName : userName || genUserName,
                email,
                password: hashedPassword,
            }
        });
        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)
       await sendConfirmationEmail(email , accessToken) ;

        
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 60*60*24 
        })
    
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
           
         });
        
        res.status(201).json({message : 'you have registered successfully'});
            

    } catch (error) {
        console.log(error);
        if(user){
            await prisma.user.delete({
                where:{
                    id: user.id
                }
            })
        }
        return res.status(error.status || 500).json({
            error: error.message
        });
    }
};


exports.confirmUser=async(req,res)=>{
    const {token} = req.params
    console.log(req.cookies)
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
         user = await prisma.user.update({
            where: {
                id: decoded.id
            },
            data: {
                isActivated : true
            }})
         res.status(200).json({message:"Account activated successfully"})
    }
    catch(error){
        console.log(error.message)
        res.status(403).json({message:"Invalid or expired token"})
    }

}