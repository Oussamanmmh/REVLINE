const prisma = require('../../prismaClient')
const { validationResult } = require('express-validator');
const questionQuery = require('../utils/searchQuery')

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
    console.log(tags)

    try {
       
        const question = await prisma.question.create({
            data:{
                title,
                description,
                userId :13
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
        res.status(500).json({message:'Internal server error'})
    }
}
//answer a question 
const answerQuestion = async (req , res)=>{
    const {questionId} = req.params 
    const {content} = req.body
    try {
        const answer = await prisma.answer.create({
            data:{
                content,
                userId :13,
                questionId :  parseInt(questionId)
            }
        })
        res.status(201).json({message:'Answer added successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }}


//Vote on a answer 
const voteAnswer = async (req, res)=>{
    const {answerId , isUpvote} = req.query
    console.log(answerId)
    console.log(isUpvote)
    try{
        const vote = await prisma.vote.create({
            data:{
                answerId:parseInt(answerId),
                isUpvote : isUpvote === 'true' ? true : false,
                userId:13
            }
        })
        return res.status(201).json({message:'Vote added successfully'})
    }catch(e){
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