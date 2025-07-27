const http = require('http');
const port = 4000;

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'content-type': 'application/json'
    });
    res.end(JSON.stringify({a: "a", b: "b"}));
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})