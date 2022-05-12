const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const question = require('./controller/question');
const cors = require('cors');


var app = express();

mongoose.connect('mongodb://localhost:27017/');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/question', question);

app.listen(5000);