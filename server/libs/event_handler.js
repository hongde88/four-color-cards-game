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

    // pick a card for seat selection handler
    this.socket.on(
      'pick a card for seat selection',
      this.handlePickACardForSeatSelectionEvent()
    );

    // pick a card for priority handler
    this.socket.on(
      'pick a card for priority',
      this.handlePickACardForPriorityEvent()
    );

    // disconnect handler
    this.socket.on(
      'disconnect',
      this.handleDisconnectOrLeaveEvent('disconnect')
    );

    // leave handler
    this.socket.on('leave a room', this.handleDisconnectOrLeaveEvent('leave'));
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
      if (!data.roomId) {
        // this.socket.playerName = data.playerName;
        data.roomId = randomString.generate(9);
        // this.socket.roomId = data.roomId;
        rooms[data.roomId] = new Room(data.roomId);
      }

      if (!rooms[data.roomId]) {
        return callback
          ? callback({
              type: 'room error',
              message: 'room does not exist',
            })
          : null;
      }

      this.socket.playerName = data.playerName;
      this.socket.roomId = data.roomId;

      // check if player name exists
      const playerIdx = rooms[data.roomId].players.findIndex(
        (player) => player.name === data.playerName
      );

      if (playerIdx !== -1) {
        return callback
          ? callback({
              type: 'player error',
              message: 'name already exists',
            })
          : null;
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

        return callback
          ? callback({
              playerName: data.playerName,
              isHost: data.playerName === rooms[data.roomId].host,
            })
          : null;
      } else {
        this.socket.playerName = null;
        this.socket.roomId = null;

        return callback
          ? callback({
              type: 'room error',
              message: 'room is full',
            })
          : null;
      }
    };
  }

  handlePickACardForSeatSelectionEvent() {
    return (data, callback) => {
      const roomId = data.roomId || this.socket.roomId;
      const playerName = data.playerName || this.socket.playerName;
      const cardForSeatIdx = data.cardForSeatIdx || 0;

      if (roomId && rooms[roomId]) {
        const room = rooms[roomId];
        // check if all players have selected their seats
        if (room.currentSeatPickerIdx < room.priorities.length) {
          const cardForSeat = room.getARandomCardForSeatSelection();
          const cardPicker = room.players.find(
            (player) => player.name === playerName
          );
          room.seats[cardForSeat.color] = cardPicker;
          cardPicker.seatCard = cardForSeat;
          const response = {
            cardForSeat,
            playerName,
            playerAvatarIndex: cardPicker.avatarIndex,
            cardForSeatIdx,
          };

          this.io.to(roomId).emit('a card picked for seat selection', response);

          room.currentSeatPickerIdx++;
          if (room.currentSeatPickerIdx < room.priorities.length) {
            this.io.to(roomId).emit('update room info', {
              currentSeatPickerIdx: room.currentSeatPickerIdx,
              currentSeatPicker:
                room.priorities[room.currentSeatPickerIdx].name,
            });
          } else {
            room.currentSeatPicker = null;
            this.io.to(roomId).emit('update room info', {
              currentSeatPickerIdx: null,
              currentSeatPicker: null,
            });
          }
        }

        return callback ? callback(response) : null;
      }
    };
  }

  handleDisconnectOrLeaveEvent(type) {
    return () => {
      if (type === 'disconnect') {
        console.log(
          `a client ${this.socket.id} has been disconnected from the server`
        );
      } else {
        console.log(
          `a client ${this.socket.id} has left the room ${this.socket.roomId}`
        );
      }

      const roomId = this.socket.roomId;
      const playerName = this.socket.playerName;

      if (roomId) {
        if (rooms[roomId] && rooms[roomId].players) {
          rooms[roomId].removePlayer(playerName);
          if (rooms[roomId] && rooms[roomId].players.length === 0) {
            delete rooms[roomId];
            delete messageCache[roomId];
            return;
          }
          // } else {
          //   if (playerName === rooms[roomId].host) {
          //     rooms[roomId].host = rooms[roomId].players[0];
          //   }
          //   if (
          //     playerName === rooms[roomId].currentPlayer &&
          //     rooms[roomId].guessRemainingTime >= 0
          //   ) {
          //     rooms[roomId].isCurrentPlayerLeft = true;
          //     this.calculateTurnScoreAndBroadcast(roomId);
          //   }
          // }
        }

        if (rooms[roomId]) {
          this.socket.to(roomId).emit('user left', {
            host: rooms[roomId].host,
            playable: rooms[roomId].players.length === 4,
            players: rooms[roomId].players,
          });
          const message = `${playerName} just left.`;
          if (messageCache[roomId]) {
            messageCache[roomId].push({ message, color: 'red' });
          }
          this.socket.to(roomId).emit('new message', { message, color: 'red' });
        }

        this.socket.leave(roomId);
        this.socket.roomId = null;
        this.socket.playerName = null;
      }
    };
  }

  handlePickACardForPriorityEvent() {
    return (data) => {
      const playerName = data.playerName || this.socket.playerName;
      const roomId = data.roomId || this.socket.roomId;

      if (roomId && rooms[roomId]) {
        const room = rooms[roomId];
        const card = room.getARandomCard();
        const player = room.players.find(
          (player) => player.name === playerName
        );
        player.priorityCard = card;
        player.priority = card.rank;
        room.priorities = [...room.players].sort(
          (player1, player2) => player2.priority - player1.priority
        );
        this.io.to(roomId).emit('update room info', room);
        this.socket.emit('update player info', {
          priorityCard: card,
          priority: card.rank,
        });

        if (
          room.priorities &&
          room.priorities.length === 4 &&
          !room.priorities.some((player) => player.priority === null)
        ) {
          room.gameStarter = room.priorities[0];
          setTimeout(() => {
            room.gameState = 'picking seats';
            room.currentSeatPickerIdx = 0;
            this.io.to(roomId).emit('update room info', {
              gameState: room.gameState,
              currentSeatPickerIdx: room.currentSeatPickerIdx,
              currentSeatPicker:
                room.priorities[room.currentSeatPickerIdx].name,
              gameStarter: room.gameStarter,
            });
          }, 100);
        }
      }
    };
  }
}

module.exports = EventHandler;
