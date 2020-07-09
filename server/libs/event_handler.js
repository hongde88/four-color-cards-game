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

    // set room current player selected card handler
    this.socket.on(
      'set room current player selected card',
      this.handleSetRoomCurrentPlayerSelectedCardEvent()
    );

    // set room current player final card handler
    this.socket.on(
      'set room current player final card',
      this.handleSetRoomCurrentPlayerFinalCardEvent()
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
        this.io
          .to(data.roomId)
          .emit('room joined', rooms[data.roomId].toJSON());

        return callback
          ? callback({
              name: data.playerName,
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

            // Set adjacent players
            room.seats['green'].adjacentPlayer = room.seats['yellow'];
            room.seats['yellow'].adjacentPlayer = room.seats['red'];
            room.seats['red'].adjacentPlayer = room.seats['white'];
            room.seats['white'].adjacentPlayer = room.seats['green'];

            // Get players in the right order
            const firstPlayer = room.priorities[0];
            const secondPlayer = firstPlayer.adjacentPlayer;
            const thirdPlayer = secondPlayer.adjacentPlayer;
            const fourthPlayer = thirdPlayer.adjacentPlayer;

            // Deal cards
            const piles = room.deal();
            firstPlayer.cards = piles[0];
            secondPlayer.cards = piles[1];
            thirdPlayer.cards = piles[2];
            fourthPlayer.cards = piles[3];

            // Done picking seats. Start the game
            room.gameState = 'starting';
            room.cardsRemainingInDeck = room.deckOfCards.length;
            this.io.to(roomId).emit('update room info', room.toJSON());

            // Send dealt cards to players
            this.io.to(firstPlayer.socketId).emit('update player info', {
              cards: firstPlayer.cards,
            });

            this.io.to(secondPlayer.socketId).emit('update player info', {
              cards: secondPlayer.cards,
            });

            this.io.to(thirdPlayer.socketId).emit('update player info', {
              cards: thirdPlayer.cards,
            });

            this.io.to(fourthPlayer.socketId).emit('update player info', {
              cards: fourthPlayer.cards,
            });

            setTimeout(() => {
              const gameStarterName = room.priorities[0].name;
              room.currentPlayer = room.priorities[0];
              this.io.to(roomId).emit('update room info', {
                action: `${gameStarterName}, place a card to start the game`,
                turnPlayerName: gameStarterName,
              });
            }, 1000);
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
          setTimeout(() => {
            room.gameState = 'picking seats';
            room.currentSeatPickerIdx = 0;
            this.io.to(roomId).emit('update room info', {
              gameState: room.gameState,
              currentSeatPicker:
                room.priorities[room.currentSeatPickerIdx].name,
            });
          }, 100);
        }
      }
    };
  }

  handleSetRoomCurrentPlayerSelectedCardEvent() {
    return (data) => {
      const roomId = this.socket.roomId;

      if (roomId && rooms[roomId]) {
        rooms[roomId].currentPlayerSelectedCard =
          data.currentPlayerSelectedCard;
        this.io.to(roomId).emit('update room info', data);
      }
    };
  }

  handleSetRoomCurrentPlayerFinalCardEvent() {
    return (data) => {
      const roomId = this.socket.roomId;

      if (roomId && rooms[roomId]) {
        if (
          data.currentPlayerFinalCard &&
          data.currentPlayerFinalCard.character === 'general'
        ) {
          // don't allow users to place a general card
          return this.socket.emit('update room info', {
            action:
              'Please place another card because general cards are not placeable',
          });
        }

        rooms[roomId].currentPlayerFinalCard = data.currentPlayerFinalCard;
        rooms[roomId].currentPlayer.cards = data.currentPlayerCards;
        rooms[roomId].currentPlayer.cards.splice(
          data.currentPlayerFinalCardIdx,
          1
        );

        rooms[roomId].currentPlayer.discarded.push(data.currentPlayerFinalCard);
        this.io.to(roomId).emit('update room info', {
          ...rooms[roomId].toJSON(),
          currentPlayerFinalCard: data.currentPlayerFinalCard,
        });
        this.socket.emit('update player info', {
          cards: rooms[roomId].currentPlayer.cards,
          melded: rooms[roomId].currentPlayer.melded,
          discarded: rooms[roomId].currentPlayer.discarded,
        });
      }
    };
  }
}

module.exports = EventHandler;
