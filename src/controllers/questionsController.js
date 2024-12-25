const prisma = require('../../prismaClient')
const { validationResult } = require('express-validator');
const questionQuery = require('../utils/searchQuery');
const { decodeToken } = require('../utils/jwt');
const { NotificationType } = require('@prisma/client');

//add new question
const addQuestion =async (req , res)=>{  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'failed',
            message: 'Validation Error',
            errors: errors.array().map(error => {return {message :error.msg}})
        });
    }
    const {
        title ,
        description , 
        tags 
    } = req.body ;
        const token = req.cookies.access_token
    try {
        const userId = decodeToken(token)
        const question = await prisma.question.create({
            data:{
                title,
                description,
                userId
            }
        })
        if(tags.length !== 0){
        tags.forEach(async tagId => {
           await prisma.questionTag.create({
                data:{
                    questionId:question.id,
                    tagId
                }
            })
        
        })};
        res.status(201).json({message:'Question added successfully'})
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({message:error.message || 'Internal server error'})
    }
}
//answer a question 
const answerQuestion = async (req , res)=>{
    const {questionId} = req.params 
    const {content} = req.body
    const token = req.cookies.access_token
    try {  
        if(!content)return res.status(400).json({message:"Please , complete your answer"}) 
        const userId = decodeToken(token)
        const newAnswer = await prisma.answer.create({
            data:{
                content,
                userId :parseInt(userId),
                questionId : parseInt(questionId)
            },
        })
        const questionTarget = await prisma.question.findUnique({ 
            where:{
                id:parseInt(questionId)
            }
        })
        
        if(questionTarget.userId !== parseInt(userId))
        {
        await prisma.notification.create({
            data:{
                fromUserId:parseInt(userId),
                type:NotificationType.NEW_ANSWER,
                userTargetId: questionTarget.userId,
                metaData:JSON.stringify({
                    questionId:questionTarget.id,
                    answerId: newAnswer.id
                }),
                content:`Your question "${questionTarget.title}" has a new answer from ${prisma.user.findUnique({where:{id:parseInt(userId)},select:{userName:true}})}`
            }
        })
    }
        res.status(201).json({message:'Answer added successfully'})
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({message:error.message || 'Internal server error'})
    }}


//Vote on a answer 
const voteAnswer = async (req, res)=>{
    const {answerId , isUpvote} = req.query
    const token = req.cookies.access_token
    try{
        const userId  = decodeToken(token)
        const vote = await prisma.vote.create({
            data:{
                answerId:parseInt(answerId),
                isUpvote : isUpvote === 'true' ? true : false,
                userId
            }
        })
        return res.status(201).json({message:'Vote added successfully'})
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

//remove vote 
const removeVote = async(req,res)=>{
    const {answerId} = req.query
    try{
        await prisma.vote.update({
            where:{
                userId:13 ,
                answerId:parseInt(answerId)
            },
            data:{
                isUpvote:false
            }
        })
    }
    catch(e){
        return res.status(500).json({message: e.message})
    }
}


//Get all the questions
const getAllQuestions=async(req,res)=>{
    try{
        //get all questions 
        const questions = await prisma.question.findMany({...questionQuery ,
            orderBy:{
            createdAt: 'desc'
        }}) 
        if (questions.length === 0){
            return res.status(404).json({message:'There is no question yet'})
                }
        return res.status(200).json({questions:questions})
     }
     catch(e){
        return res.status(500).json({message: e.message})
     }
    }

//Get questions by user 
const getQuestionByUser =  async (req , res)=>{
    const {userId} = req.params 
    try{    
        user = await prisma.user.findUnique({
            where:{
                id :userId
            }
        })
        if (!user){
            return res.status(402).json({message :"User not found"})
        }
        const questions = await prisma.question.findMany({
            where:{
                userId:parent(userId)
            },
            ...questionQuery ,
            orderBy:{
                createdAt:'desc'
            }
        }
        )
        if (questions.length === 0)
        {
            return res.status(404).json({message:"There is no question"})
        }
        return res.status(200).json({questions:questions})
    }
    catch(e){
        return res.status(500).json({message :"Server error"})
    }
}

//Get a specific question
const getQuestion = async (req , res)=>{
    const {questionId} = req.params 
    try{
        const question = await prisma.question.findUnique({
            where:{
                id:parseInt(questionId)
            } ,
            ...questionQuery 
        })
        if (!question){
            return res.status(404).json({message:'Question not found'})
        }
        return res.status(200).json({question:question})
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}
module.exports = {addQuestion , getAllQuestions , answerQuestion ,voteAnswer , getQuestion}