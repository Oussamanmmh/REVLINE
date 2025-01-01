const { NotificationType, TargetEntityType } = require('@prisma/client');
const prisma = require('../../prismaClient')
const { decodeToken } = require("../utils/jwt");
const subscribers = require('../services/subscribe');


const answerQuestion = async (req, res) => {
    const { questionId } = req.params;
    const { content } = req.body;
    const token = req.cookies.access_token;
    try {
      // Validate content
      if (!content) {
        return res.status(400).json({ message: "Please, complete your answer" });
      }
      const userId = decodeToken(token);
      const questionIdInt = parseInt(questionId);
      const questionTarget = await prisma.question.findUnique({
                    where: { id: questionIdInt },
                    select: { 
                        id: true ,
                        userId: true,
                        title: true,
                     }});
     // Check if the question exists
     if(!questionTarget) return res.status(404).json({message:'Question not found'})
     // Create the answer
     const newAnswer = await  prisma.answer.create({
        data: {
            content,
            userId,
            questionId: questionIdInt,
        },
        })

      // Send a notification only if the answerer is not the question owner
      if ( questionTarget.userId !== userId) {
        let notification ;
        // Send a notification to the question owner
        const userName = (await prisma.user.findUnique({
          where: { id: userId },
          select: { userName: true },
        }))?.userName;
        console.log(userName)
        notification = await prisma.notification.create({
            data: {
              actorId: userId,
              type: NotificationType.NEW_ANSWER,
              targetUserId: questionTarget.userId,
              targetEntityType: TargetEntityType.ANSWER ,
              targetEntityId: newAnswer.id,
              content: `Your question "${questionTarget.title}" has a new answer from ${userName}`,
            },
          }); 
          
          console.log(subscribers)
        //send the notification
        const subscriber = subscribers.get(questionTarget.userId);
        if (subscriber) {
          subscriber.write(`data: ${JSON.stringify(notification)}\n\n`);
        }

      }
      return res.status(201).json({ message: "Answer added successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Internal server error" });
    }
  };
  

//Vote on a answer 
const voteAnswer = async (req, res) => {
    const { answerId, isUpvote } = req.query;
    const token = req.cookies.access_token;
  
    try {
      const userId = decodeToken(token); 
      const parsedAnswerId = parseInt(answerId);
  
      if (!parsedAnswerId || isUpvote === undefined) {
        return res.status(400).json({ message: "Invalid input parameters" });
      }
       // Fetch the answer and its owner
       const answer = await prisma.answer.findUnique({
        where: { id: parsedAnswerId },
        select: {
          userId: true,
          question: {
            select: { id: true, title: true },
          },
        },
      });
  
      if (!answer) {
        return res.status(404).json({ message: "Answer not found" });
      }

      const existingVote = await prisma.vote.findUnique({
        where: {
            userId_answerId: { userId, answerId: parsedAnswerId },  
        },
      });
      
      let voteAction;
  
      if (existingVote) {
        if (existingVote.isUpvote !== (isUpvote === "true")) {
          await prisma.vote.update({
            where: {
                userId_answerId: {
                  userId: userId,
                  answerId: parseInt(answerId),
                }},
            data: { isUpvote: isUpvote === "true" },
          });
          voteAction = "updated";
        } else {
          return res.status(200).json({ message: "No changes to your vote" });
        }
      } else {
        // Create a new vote
        await prisma.vote.create({
          data: {
            answerId: parsedAnswerId,
            isUpvote: isUpvote === "true",
            userId,
          },
        });
        voteAction = "created";
      }
  
    
        await prisma.notification.create({
          data: {
            actorId: userId,
            type : NotificationType.NEW_VOTE ,
            targetUserId: answer.userId,
            targetEntityType: TargetEntityType.ANSWER,
            targetEntityId: parsedAnswerId,
            content: `Your answer on the question "${answer.question.title}" has received a ${isUpvote === "true" ? "new upvote" : "new downvote"}.`,
          },
        });
      
  
      return res
        .status(201)
        .json({ message: voteAction === "updated" ? "Your vote has been updated" : "Your vote has been registered successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  };


module.exports = { answerQuestion , voteAnswer };