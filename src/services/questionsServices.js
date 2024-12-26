const {check} = require('express-validator')
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

module.exports = { validateTitle , validateDescription }