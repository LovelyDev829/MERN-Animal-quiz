const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    content: String,
    path: Boolean,
    leaf: Boolean,
    parentId: {
        type: String
    }
});

var Question = mongoose.model("Question", questionSchema);

module.exports = Question;