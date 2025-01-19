const express = require('express');
const cors = require('cors');

const MongoDB = require('./app/utils/mongodb.util');
const ContactService = require('./app/services/contact.service');

const ApiError = require('./app/api-error');
const app = express();
const contactRouter = require('./app/routes/contact.router');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to contact book application' });
});

app.use('/api/contacts', contactRouter);

//handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, 'Resource not found'));
});
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;