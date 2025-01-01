const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../../prismaClient');
const generateUserName = require('../utils/generUserName');


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        email: profile.emails[0].value,
                    },
                });
                if (user) {
                    return done(null, user);
                }
                const userName = await generateUserName(profile.name.givenName, profile.name.familyName);
                const newUser = await prisma.user.create({
                    data: {
                        googleId : profile.id,
                        email: profile.emails[0].value,
                        firstName: profile.name.givenName,
                        userName ,
                        lastName: profile.name.familyName,
                        isActivated:true
                    },
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        done(null, user);
    } catch (error) {
        done(error);
    }
});