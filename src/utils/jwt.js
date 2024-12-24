const jwt = require('jsonwebtoken');
const CustomError = require('./customError');


//function to generate the access token
exports.generateAccessToken=(usedId)=>{
    return jwt.sign({
        id : usedId 
    },
    process.env.JWT_SECRET,
    {
        expiresIn  : process.env.JWT_ACCESS_EXPIRE_IN
    }
   )
 
}

//function to generate the refresh token
exports.generateRefreshToken=(usedId)=>{
    return jwt.sign({
        id : usedId 
    },
    process.env.JWT_REFRESH_SECRET,
    {
        expiresIn  : process.env.JWT_REFRESH_EXPIRE_IN
    }
   )
 
}

exports.decodeToken=(token)=>{
   
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        return decode.id
    }
    catch(e){
        throw new CustomError({status : 401 , message : 'Invalid token'})
    }
}