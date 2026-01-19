const http = require('node:http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Alive');
    res.end();
});

module.exports = () => {
    server.listen(3000, () => {
        console.log('Keep-Alive Server is running on port 3000');
    });
};
