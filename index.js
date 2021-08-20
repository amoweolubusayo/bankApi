const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const fs = require("fs");

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10 // limit each IP to 10 requests per windowMs
});
app.use(limiter);

const appserver = http.createServer(app); //create server

const io = new Server(appserver);
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('submit', (msg) => {
        if (msg.type == 'event.interaction') {
            const CreateFiles = fs.createWriteStream('interactions.txt', {
                flags: 'a'
            })
            CreateFiles.write(msg.data + '\r\n')
        }
        if (msg.type == 'event.error') {
            const CreateFiles = fs.createWriteStream('errors.txt', {
                flags: 'a'
            })
            CreateFiles.write(msg.data + '\r\n')
        }

    });
});
// server listening 
appserver.listen(port, () => {
    console.log(`Server running on port ${port}`);
});