const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const EventHandler = require('./libs/event_handler');
const PORT = process.env.PORT || 5001;

class Server {
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = socketIO(this.httpServer, { pingTimeout: 30000 });
    this.initialize();
  }

  initialize() {
    // Register json parser middleware
    this.app.use(express.json({ extended: false }));

    if (process.env.NODE_ENV === 'production') {
      // Set static folder
      this.app.use(express.static(path.join(__dirname, 'client', 'build')));

      // Allow CORS
      this.app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', '*');
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
      });

      this.app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
      });
    }

    this.io.on('connection', (socket) => {
      console.log(`a client ${socket.id} has been connected to the server`);
      const eventHandler = new EventHandler(this.io, socket);
      eventHandler.handleGameEvents();
    });
  }

  start() {
    this.httpServer.listen(PORT, () =>
      console.log(`Server started on port ${PORT}`)
    );
  }
}

module.exports = Server;
