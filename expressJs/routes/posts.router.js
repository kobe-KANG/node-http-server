const express = require('express');
const postsController = require('../controllers/posts.controller.js');

const postsRouter = express.Router();

postsRouter.get('/', postsController.getPost);


module.exports = postsRouter;