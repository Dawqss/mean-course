const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const key = require('./key');

const app = express();

mongoose.connect(key)
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Error with connection to db :(');
    });

const Post = require('./models/post');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(result => {
        res.status(201).json({
            message: 'Post fetched successfuly',
            postId: result._id
        });
    });
});

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Fuck yeah',
                posts: documents
            });
        });
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'postDeleted',
                id: req.params.id
            })
        });
});


module.exports = app;