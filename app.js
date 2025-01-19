const express = require('express');
const cors = require('cors');

const app = express();
const contactRouter = require('./app/routes/contact.router');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to contact book application' });
});

app.use('/api/contacts', contactRouter);

module.exports = app;