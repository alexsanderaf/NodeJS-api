const http = require('http');
const port = process.env.PORT || 3000; //VARIÁVEL DE AMBIENTE
const app = require('./app'); //import do app.js

const server = http.createServer(app);

server.listen(port);

console.log(`Server is running on port ${port}`)