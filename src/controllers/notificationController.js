const prisma = require('../../prismaClient')
const { decodeToken } = require('../utils/jwt')
const getNotifications=async(req,res)=>{
    const token = req.cookies.access_token
    try{
        userId = decodeToken(token)
        const notifications = await prisma.notification.findMany({
            where:{
                userId
            }
        })
        if(notifications.length===0)return res.status(404).json({message:"You got no notification yet"})
        return res.status(200).json({notifications:notifications})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({message:"Sorry, Server Error"}) 
    }

}
