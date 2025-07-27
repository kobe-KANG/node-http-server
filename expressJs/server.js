const express = require('express');
const usersRouter = require('./routes/users.router.js');
const postsRouter = require('./routes/posts.router.js');

// constants
const PORT = 4000;
const HOST = '0.0.0.0';

// App
const app = express();

// middleware setting
app.use(express.json());
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[S][${req.method}] ${req.url}`);
    next();
    const diffTime = Date.now() - start;
    console.log(`[E][${req.method}] ${req.baseUrl}/${req.url} ${diffTime}ms`);
});

// home
app.get('/', (req, res) => {
    res.send("Hello, World!");
});

// route setting
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

//
app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
