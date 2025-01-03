//Reuirements
const express = require('express');
const cors = require('cors');
const { join } = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const prisma = require('./prismaClient')
const admin = require('./prisma/admin').default
require('./src/middlewares/passportSetup')

//Routes import
const authRoutes = require('./src/routes/authRoutes')
const questionRoutes = require('./src/routes/questionRoutes')
const notificationsRoutes = require('./src/routes/notificationsRoutes')
const answersRoutes = require('./src/routes/answersRoutes')
//Express app initialization
const app = express();

//Middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());

//Routes

app.use('/auth' , authRoutes)
app.use('/questions' , questionRoutes)
app.use('/answers' , answersRoutes)
app.use('/notifications' ,notificationsRoutes)
// Handle WebSocket connections


//Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


//Routes does not exist
app.use((req, res) => {
    res.status(404).json({Message:'Route does not exist'});
});

//Disconnect from database and exit process
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
//Export app
module.exports = app;