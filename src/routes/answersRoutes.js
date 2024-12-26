const express = require('express')
const answerController = require('../controllers/answersController')
const router = express.Router()



router.post('/answer-question/:questionId' , answerController.answerQuestion)
router.get('/vote-answer' , answerController.voteAnswer)



module.exports = router