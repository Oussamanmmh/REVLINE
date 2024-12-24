const express = require('express')
const addQuestion = require('../controllers/questionsController')
const {check} = require('express-validator')
const questionsController = require('../controllers/questionsController')
const { route } = require('./authRoutes')
const router = express.Router()

const validateTitle = check("title").notEmpty().withMessage("title is required").custom(
    (title)=>{
        if (title.trim().length === 0){
            throw new Error("Please enter the title of you question .")
        }
        return true
    }
)
const validateDescription = check("description").notEmpty().withMessage("description is required").custom(
    (description)=>{
        if (description.trim().length === 0){
            throw new Error("Please enter your question .")
        }
        return true
    }
)

router.post('/add-question' , [validateTitle , validateDescription],questionsController.addQuestion)
router.get('/all-questions', questionsController.getAllQuestions)
router.get('/one-question/:questionId', questionsController.getQuestion)
router.post('/answer-question/:questionId' , questionsController.answerQuestion)
router.get('/vote-answer' , questionsController.voteAnswer)



module.exports = router