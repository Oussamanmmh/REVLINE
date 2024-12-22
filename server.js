const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});