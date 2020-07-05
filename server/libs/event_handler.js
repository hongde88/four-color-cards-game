const nameGenerator = require('fakerator')();
const randomString = require('randomstring');
const Room = require('../models/room');
const messageCache = {};
const rooms = {};

class EventHandler {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  handleGameEvents() {
    // chat handler
    this.socket.on('new message', this.handleNewMessageEvent());

    // create new room handler
    this.socket.on('join a room', this.handleJoinARoomEvent());
  }

  handleNewMessageEvent() {
    return (data = { playerName, roomId, message }) => {
      const playerName = data.playerName || this.socket.playerName;
      const roomId = data.roomId || this.socket.roomId;

      if (!rooms[roomId]) return;

      const message = `${playerName}: ${data.message}`;
      messageCache[roomId] = messageCache[roomId] || [];
      messageCache[roomId].push(message);
      this.io.to(roomId).emit('new message', { message });
    };
  }

  handleJoinARoomEvent() {
    return (data = { playerName, avatarIndex, roomId }, callback) => {
      data.playerName = data.playerName || nameGenerator.names.firstName();
      data.roomId = data.roomId || this.socket.roomId;
      data.avatarIndex = data.avatarIndex || 0;

      // room id doesn't exist
      if (!rooms[data.roomId]) {
        this.socket.playerName = data.playerName;
        data.roomId = randomString.generate(9);
        this.socket.roomId = data.roomId;
        rooms[data.roomId] = new Room(data.roomId);
      }

      // check if player name exists
      const playerIdx = rooms[data.roomId].players.findIndex(
        (player) => player.name === data.playerName
      );

      if (playerIdx !== -1) {
        if (callback) {
          return callback({
            type: 'user error',
            message: 'name already exists',
          });
        } else {
          return this.socket.emit('name exists');
        }
      }

      // add a new player
      const joined = rooms[data.roomId].acceptPlayer(
        data.playerName,
        data.avatarIndex,
        this.socket.id
      );

      if (joined) {
        this.socket.join(data.roomId);
        this.io.to(data.roomId).emit('room joined', rooms[data.roomId]);
      } else {
        this.socket.playerName = null;
        this.socket.roomId = null;
        if (callback) {
          return callback({
            type: 'room error',
            message: 'room is full',
          });
        } else {
          return this.socket.emit('room full');
        }
      }
    };
  }
}

module.exports = EventHandler;
