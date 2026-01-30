const http = require('node:http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Alive');
    res.end();
});

module.exports = () => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Keep-Alive Server is running on port ${port}`);
    });
};
