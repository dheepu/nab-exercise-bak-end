const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./api/routes/userRoute');
const taskRouter = require('./api/routes/taskRoute');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

mongoose.connect('mongodb+srv://gopidheepu:'+ process.env.MONGO_ATLAS_PW +'@cluster0-96j3n.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true,
    useCreateIndex: true
});

app.get('/', (req, res) => {
    res.send('application running');
});

app.use('/user', userRouter);
app.use('/task', taskRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

module.exports = app;