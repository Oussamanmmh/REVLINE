const express = require('express')
const prisma = require('../../prismaClient');
const subscribers = require('../services/subscribe');
const { decodeToken } = require('../utils/jwt');

const router = express.Router()

//Subscribe for notifications 

//This route is used to subscribe for notifications
router.get('/subscribe-notification/',async(req , res)=>{
    
    try{
            const userId = decodeToken(req.cookies.access_token)
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: Token missing or invalid' });
            }            
            const user = await prisma.user.findUnique({where:{id : parseInt(userId)}})
            if(!user) return res.status(404).json({message:'User not found'})
            console.log(`User ${userId} subscribed for notifications`);
            res.header('Content-Type','text/event-stream')
            res.header('Connection','keep-alive')
            res.header('Cache-Control','no-cache')
            subscribers.set(userId , res)

            req.on('close',()=>{
                subscribers.delete(userId)
            })
}
    catch(e){
        console.error(e)
        return res.status(500).json({message: e.message})
    } 
})


module.exports = router , subscribers
