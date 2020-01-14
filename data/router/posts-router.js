const express = require('express');

const router = express.Router();

const posts = require('../db.js');

// GET - See all the posts in the database

router.get('/', (req, res) => {
    posts.find()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            errorMsg: 'The posts information could not be retrieved.'
        });
    });
});

// GET - Returns a post based of a specific ID

router.get('/:id', (req, res) => {
    posts.findById(req.params.id)
    .then(post => {
        if (!post) {
            res.status(404).json({
                errorMsg: 'The post with the specified ID does not exist.'
            })
        }
        else if (post) {
            res.status(200).json(post)
        }
        else {
            res.status(500).json({
                errorMsg: 'The post information could not be retrieved.'
            })
        }
    });
});

// GET - Return an array of all the comment objects associated with a particular post ID

router.get('/:id/comments', (req, res) => {
    posts.findPostComments(req.params.id)
    .then(comments => {
        if (!comments) {
            res.status(404).json({
                errorMsg: 'The post with the specified ID does not exist.'
            })
        }
        else if (comments) {
            res.status(200).json(comments)
        }
        else {
            res.status(500).json({
                errorMsg: 'The comments information could not be retrieved.'    
            })
        }
    });
});

// POST - Create a post using information sent in the request body

router.post('/', (req, res) => {
    const data = req.body
    const {title, contents} = data
    posts.insert(req.body)
    .then(post => {
        if (!title || !contents) {
            res.status(400).json({
                errorMsg: 'Please provide title and contents for the post.'
            })
        }
        else if (post) {
            res.status(201).json(post)
        }
        else {
            res.status(500).json({
                errorMsg: 'There was an error while saving the post to the database'
            })
        }
    });
});

// POST - Create a comment for the post with the specified ID passed in the request body

router.post('/:id/comments', (req, res) => {
    const newComment = req.body
    const {text, post_id} = newComment
    posts.insertComment(req.body)
    .then(comment => {
        if (!post_id) {
            res.status(404).json({
                errorMsg: 'The post with the specified ID does not exist.'
            })
        }
        else if (!text) {
            res.status(400).json({
                errorMsg: 'Please provide text for the comment.'
            })
        }
        else if (text && post_id) {
            res.status(201).json(comment)
        }
        else {
            res.status(500).json({
                errorMsg: 'There was an error while saving the comment to the database'
            })
        }
    });
});

// DELETE - Removes a post with the specified ID and returns the deleted post object.

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    posts.remove(id)
    .then(response => {
        if (!id) {
            res.status(404).json({
                errorMsg: 'The post with the specified ID does not exist.'
            })
        }
        else if (id) {
            res.status(200).json(response)
        }
        else {
            res.status(500).json({
                errorMsg: 'The post could not be removed'
            })
        }
    });
});

//  PUT - Updates the post with the specified ID using data from the request body,
//        returns the modified post, not the original.

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedPost = req.body;
    const {title, contents} = updatedPost;

    posts.update(id, updatedPost)
    .then(response => {
       if (!id) {
           res.status(404).json({
               errorMsg: 'The post with the specified ID does not exist.'
           })
       }
       else if (!title || !contents) {
           res.status(400).json({
               errorMsg: 'Please provide title and contents for the post.'
           })
       }
       else if (response) {
           res.status(200).json({
               message: 'Post info was updated successfully'
           })
       } 
       else {
           res.status(500).json({
               errorMsg: 'The post information could not be modified.'
           })
       }
    });
});

module.exports = router;

