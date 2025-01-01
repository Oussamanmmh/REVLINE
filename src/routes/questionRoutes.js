const express = require('express')
const addQuestion = require('../controllers/questionsController')
const questionsController = require('../controllers/questionsController')
const validateQuestion = require('../services/questionsServices')
const router = express.Router()

router.post('/add-question' ,
     [validateQuestion.validateTitle , validateQuestion.validateDescription],
     questionsController.addQuestion
    )

router.get('/all-questions', questionsController.getAllQuestions)
router.get('/one-question/:questionId', questionsController.getQuestion)
router.get('/remove-vote/:answerId' , questionsController.removeVote)
router.get('/get-userquestion/:userId', questionsController.getQuestionByUser)



module.exports = router