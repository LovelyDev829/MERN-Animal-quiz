const express = require('express');
const Question = require('../models/questionmodel');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/', async(req, res) => {
    const { oldId, content, ans, newContent } = req.body;
    const oldData = await Question.findById(oldId);
    console.log(oldData);

    let newQuestion = new Question({
        content, path: oldData.path,
        parentId: oldData.parentId,
        leaf: false
    });

    newQuestion = await newQuestion.save();
    await Question.findByIdAndUpdate(oldId, {
        parentId: newQuestion._id,
        path: (ans === 'n')
    });

    let newLeaf = new Question({
        content: newContent,
        leaf: true,
        path: (ans === 'y'),
        parentId: newQuestion.id
    });
    await newLeaf.save();
    return res.status(200).json("success");
});

router.post('/first', async(req, res) => {

    const oldQus = await Question.findOne({content: 'elephant'});
    if(oldQus) return res.status(200).json(oldQus);
    let newQuestion = new Question({
        content: 'elephant',
        path: true,
        leaf: true,
        parentId: -1
    });
    newQuestion = await newQuestion.save();
    console.log(newQuestion);
    return res.status(200).json(newQuestion);
});

router.get('/:parentId/:path', async(req, res) =>    {
    const { parentId, path } = req.params;
    console.log(parentId, path);
    const oldQuestion = await Question.findOne({parentId, path:(path === 'y')});
    return res.status(200).json(oldQuestion);
})

module.exports = router;