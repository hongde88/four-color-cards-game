const messageCache = {};
const rooms = {};

class EventHandler {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  handleGameEvents() {}
}

module.exports = EventHandler;
