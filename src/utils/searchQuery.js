const questionQuery = {

    include:{
        userId:false,
        user:{
            select:{
                id :true,
                userName:true ,
                firstName:true,
                lastName:true,
                email:true,
                profilePicture:true
            }
        },
        answers:{
            select:{
                id:true,
                content:true,
                user:{
                    select:{
                        id:true,
                        userName:true,
                        firstName:true,
                        lastName:true,
                        email:true,
                        profilePicture:true
                    }
                }
            }
        },
        questionTags:{
            select: {
                tag:true
            }
        } ,
        pictures:true 
    },
    
};
module.exports = questionQuery