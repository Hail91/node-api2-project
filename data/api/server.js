const express = require('express');

const postsRouter = require('../router/posts-router');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('<h1>This is my server, it is not the best, but it is mine.</h1>')
});

// Request to routes that begin with /api/posts

server.use('/api/posts', postsRouter);

module.exports = server;