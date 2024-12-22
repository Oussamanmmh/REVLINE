const jwt = require('jsonwebtoken');

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