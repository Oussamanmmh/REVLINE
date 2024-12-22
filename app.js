//Reuirements
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const authRoutes = require('./src/routes/authRoutes')

//Express app initialization
const app = express();

//Middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

//Routes

app.use('/api/auth' , authRoutes)

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
    await exports.prisma.$disconnect();
    process.exit();
});
//Export app
module.exports = app;