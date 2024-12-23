const prisma = require('../../prismaClient');
const CustomError = require('./customError');
// Validate user name 
exports.isValideUserName =async (userName)=>{
    //user name should be at least 6 characters and some letters and no special characters or spaces 
    const regex = /^[a-zA-Z0-9]{6,}$/;
     if (!regex.test(userName)){
         throw new CustomError({message: 'Invalid user name', status : 400} );
     }
    const user = await prisma.user.findUnique({
        where: {
            userName: userName
        }
    });
    if (user){
        throw new CustomError({message: 'User name already exists', status : 400    });
    }
    return ; 
}


// Validate email
exports.isValideEmail = async (email) => {
    //email should be valid 
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)){
       // throw new Error({message: 'Invalid email' });
       console.log('Invalid email');
       throw new CustomError({message: 'Invalid email', status : 400} );
    }
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (user){
        throw new CustomError({message: 'Email already exists', status : 400} );
    }
   
    return ; 
}