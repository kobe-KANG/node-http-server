const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const PORT = 4000;
const accessCryptoKey = 'accessSuperSecret';
const refreshCryptoKey = 'refreshSuperSecret';
const posts = [
    {
        username: 'John',
        title: 'Post 1'
    },
    {
        username: 'Han',
        title: 'Post 2'
    }
];
let refreshTokens = [];

const app = express();

// middleware setting
app.use(express.json());
app.use(cookieParser());


app.post('/login', (req, res) => {
    const username = req.body.username;
    const user =  { name : username };

    // jwt를 이용해서 access token 생성    payload + cryptoKey
    // 유효 기간 추가
    const accessToken = jwt.sign(user, 
        accessCryptoKey, 
        { expiresIn : '30s' });

    // jwt를 이용해서 refresh token 생성    payload + cryptoKey
    // 유효 기간 추가
    const refreshToken = jwt.sign(user, 
        refreshCryptoKey, 
        { expiresIn : '1d' });
    
    // refresh token 보관 (보통 DB에 저장하는데, 여기선 그냥 메모리 활용) 
    refreshTokens.push(refreshToken);

    // refresh token을 cookie에 넣어주기
    // cookie 옵션 지정
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    
    res.json({ accessToken });
})

app.get('/refresh', (req, res) => {
    // cookie에 refresh token이 존재하는지 확인
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);

    // refresh token이 DB에 존재하는지 확인
    const refreshToken = cookies.jwt;
    if(!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    
    // refresh token이 유효한 token인지 확인
    jwt.verify(refreshToken, refreshCryptoKey, (err, user) => {
        if (err) return res.sendStatus(403);
        
        // 새로운 access token 생성
        const accessToken = jwt.sign({ name: user.name }, accessCryptoKey, { expiresIn: '30s' });
        res.json({ accessToken });
    })
})

app.get('/posts', authMiddleware, (req, res) => {
    res.json(posts);
})

function authMiddleware(req, res, next) {
    // token을 request header에서 가져오기
    const authHeader = req.headers['authorization'];
    // token 형태 : Bearer QELFASDFLJALDF.DKFALJFQQWEFDFASFD.WQJFLSDHFJKASHFDOSAHF
    const token = authHeader && authHeader.split(' ')[1];

    // token이 없는 경우
    if(token == null) return res.sendStatus(401);

    // token 유효성 검증
    jwt.verify(token, accessCryptoKey, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});