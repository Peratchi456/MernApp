const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api',apiRoutes);

app.listen(PORT, () => {

    //DB Connection
    mongoose.connect('mongodb://127.0.0.1:27017/blog_db')
        .then(() => console.log("MongoDb Connected"))
        .catch(err => console.log("Error in connection", err));
    console.log(`Server is running on port ${PORT}`);
});
