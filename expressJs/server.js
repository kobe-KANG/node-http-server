const express = require('express');
const usersRouter = require('./routes/users.router.js');
const postsRouter = require('./routes/posts.router.js');
const path = require('path');

// constants
const PORT = 4000;
const HOST = '0.0.0.0';

// App
const app = express();

// application setting
// 특정 엔진을 템플릿 엔진으로 사용하기 위한 설정
app.set('view engine', 'hbs');
// view 파일들이 모여있는 폴더를 명시
app.set('views', path.join(__dirname, 'views'));

// middleware setting
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[S][${req.method}] ${req.url}`);
    next();
    const diffTime = Date.now() - start;
    console.log(`[E][${req.method}] ${req.baseUrl}/${req.url} ${diffTime}ms`);
});

// home
// app.get('/', (req, res) => {
//     res.send("Hello, World!");
// }); 
app.get('/', (req, res) => {
    res.render('index', {
        imageTitle: "It is a cuty doggy. (using template engine)"
    })
})

// route setting
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

//
app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
