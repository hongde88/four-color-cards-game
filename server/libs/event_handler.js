const nameGenerator = require('fakerator')();
const randomString = require('randomstring');
const Room = require('../models/room');
const util = require('util');
const messageCache = {};
const rooms = {};
const STRAIGHT_1 = JSON.stringify(['advisor', 'bishop', 'general']);
const STRAIGHT_2 = JSON.stringify(['cannon', 'horse', 'rook']);

const CHARACTERS = {
  general: 'Tướng',
  advisor: 'Sĩ',
  bishop: 'Tượng',
  rook: 'Xe',
  cannon: 'Pháo',
  horse: 'Mã',
  soldier: 'Chuột',
};

const COLORS = {
  green: 'xanh',
  yellow: 'vàng',
  red: 'đỏ',
  white: 'trắng',
};

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
    // this.socket.on(
    //   'set room current player selected card',
    //   this.handleSetRoomCurrentPlayerSelectedCardEvent()
    // );

    // set room current player final card handler
    this.socket.on(
      'set room current player final card',
      this.handleSetRoomCurrentPlayerFinalCardEvent()
    );

    // player action handler
    this.socket.on('player action', this.handlePlayerActionEvent());

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
            // room.seats['green'].adjacentPlayer = room.seats['yellow'];
            // room.seats['yellow'].adjacentPlayer = room.seats['red'];
            // room.seats['red'].adjacentPlayer = room.seats['white'];
            // room.seats['white'].adjacentPlayer = room.seats['green'];
            room.seats['green'].adjacentPlayer = room.seats['white'];
            room.seats['white'].adjacentPlayer = room.seats['red'];
            room.seats['red'].adjacentPlayer = room.seats['yellow'];
            room.seats['yellow'].adjacentPlayer = room.seats['green'];

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
            room.gameStarted = 'started';
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
              room.currentPlayer.action = 'play';
              const playable = room.players.every(
                (player) => player.action !== null
              );
              room.playable = playable;
              room.gameState = 'starting';
              this.io.to(roomId).emit('update room info', {
                action: `${room.currentPlayer.name} sẽ đánh trước. Đang chờ mọi người xếp bài`,
                turnPlayerName: gameStarterName,
                playable,
                enableSubmit: 0,
                enablePass: Date.now(),
              });
            }, 500);
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

  // handleSetRoomCurrentPlayerSelectedCardEvent() {
  //   return (data) => {
  //     const roomId = this.socket.roomId;

  //     if (roomId && rooms[roomId]) {
  //       rooms[roomId].currentPlayerSelectedCard =
  //         data.currentPlayerSelectedCard;
  //       this.io.to(roomId).emit('update room info', data);
  //     }
  //   };
  // }

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
            action: 'Làm ơn đánh con khác ngoài con tướng',
          });
        }

        rooms[roomId].currentPlayerFinalCard = data.currentPlayerFinalCard;
        rooms[roomId].currentPlayer.cards = data.currentPlayerCards;
        rooms[roomId].currentPlayer.cards.splice(
          data.currentPlayerFinalCardIdx,
          1
        );
        rooms[roomId].actionCount--;

        rooms[roomId].currentPlayer.discarded.push(data.currentPlayerFinalCard);
        this.io.to(roomId).emit('update room info', {
          ...rooms[roomId].toJSON(),
          currentPlayerFinalCard: data.currentPlayerFinalCard,
          action: `${rooms[roomId].currentPlayer.name} đánh ra ${
            CHARACTERS[data.currentPlayerFinalCard.character]
          } ${COLORS[data.currentPlayerFinalCard.color]}`,
          enableSubmit: Date.now(),
          enablePass: Date.now(),
          playable: false,
        });

        this.socket.emit('update player info', {
          cards: rooms[roomId].currentPlayer.cards,
          melded: rooms[roomId].currentPlayer.melded,
          discarded: rooms[roomId].currentPlayer.discarded,
        });

        // reset player actions
        rooms[roomId].players.forEach((player) => (player.action = null));
      }
    };
  }

  handlePlayerActionEvent() {
    return (data) => {
      const roomId = data.roomId || this.socket.roomId;
      const playerName = data.playerName || this.socket.playerName;

      if (roomId && rooms[roomId]) {
        const room = rooms[roomId];
        room.actionCount--;

        const player = room.players.find(
          (player) => player.name === playerName
        );

        // player.action = data.playerAction;
        // player.selectedCards = data.playerSelectedCards;
        // player.cards = data.playerCards.cards;

        if (data.playerAction === 'draw') {
          const drawnCard = room.deckOfCards.shift();
          room.currentPlayerFinalCard = drawnCard;
          room.currentPlayer.discarded.push(drawnCard);
          room.gameState = 'drawing';

          room.actionCount = 4;
          room.turnRank = -1;
          room.players.forEach((player) => (player.action = null));

          return this.io.to(roomId).emit('update room info', {
            playable: false,
            drawable: false,
            action: `${room.currentPlayer.name} bốc ${
              CHARACTERS[drawnCard.character]
            } ${COLORS[drawnCard.color]}`,
            currentPlayerFinalCard: drawnCard,
            turnPlayerName: room.currentPlayer.name,
            ...room.toJSON(),
            enablePass: Date.now(),
            enableSubmit: Date.now(),
            gameState: room.gameState,
          });
        }

        player.action = data.playerAction;
        player.selectedCards = data.playerSelectedCards;
        player.cards = data.playerCards.cards;

        /**
         * turnResult = 0 (single), 1 (straight), 2 (pair), 3 (3 of a kind)
         */
        if (
          player.action === 'submit' &&
          player.selectedCards &&
          Array.isArray(player.selectedCards)
        ) {
          if (
            player.selectedCards.length === 1 &&
            room.currentPlayer.adjacentPlayer.name === player.name &&
            player.selectedCards[0].character ===
              room.currentPlayerFinalCard.character
          ) {
            room.turnResult = 0;
          } else if (
            player.selectedCards.length === 2 &&
            player.selectedCards[0].character ===
              room.currentPlayerFinalCard.character &&
            player.selectedCards[0].color ===
              room.currentPlayerFinalCard.color &&
            player.selectedCards[1].character ===
              room.currentPlayerFinalCard.character &&
            player.selectedCards[1].color === room.currentPlayerFinalCard.color
          ) {
            room.turnResult = 2;
          } else if (
            player.selectedCards.length === 3 &&
            player.selectedCards[0].character ===
              room.currentPlayerFinalCard.character &&
            player.selectedCards[0].color ===
              room.currentPlayerFinalCard.color &&
            player.selectedCards[1].character ===
              room.currentPlayerFinalCard.character &&
            player.selectedCards[1].color ===
              room.currentPlayerFinalCard.color &&
            player.selectedCards[2].character ===
              room.currentPlayerFinalCard.character &&
            player.selectedCards[2].color === room.currentPlayerFinalCard.color
          ) {
            room.turnResult = 3;
          } else if (
            player.selectedCards.length <= 3 &&
            room.currentPlayer.adjacentPlayer.name === player.name
          ) {
            this.checkForStraight(
              room,
              player.selectedCards,
              room.currentPlayerFinalCard
            );
          }

          if (room.turnRank < room.turnResult) {
            // const card = room.currentPlayer.discarded.pop();
            // const card =
            //   room.currentPlayer.discarded[
            //     room.currentPlayer.discarded.length - 1
            //   ];
            if (!room.removeCurrentPlayerDiscardedCard) {
              room.currentPlayer.discarded.pop();
              room.removeCurrentPlayerDiscardedCard = true;
            }
            room.turnRank = room.turnResult;
            room.currentPlayer = player;
            room.selectedCards = player.selectedCards;
            player.melded.push([
              room.currentPlayerFinalCard,
              ...player.selectedCards,
            ]);
            player.tempMelded = true;
          }
        } else if (
          player.action === 'submit' &&
          player.name === room.currentPlayer.name &&
          room.currentPlayerFinalCard.character === 'general'
        ) {
          // if (!room.removeCurrentPlayerDiscardedCard) {
          room.currentPlayer.discarded.pop();
          // room.removeCurrentPlayerDiscardedCard = true;
          // }
          // room.turnRank = room.turnResult;
          // room.currentPlayer = player;
          // room.selectedCards = player.selectedCards;
          player.melded.push([room.currentPlayerFinalCard]);
        }

        let otherPlayers = room.players.filter(
          (player) => player.name !== room.currentPlayer.name
        );

        const allPasses = otherPlayers.every(
          (player) => player.action === 'pass'
        );

        // console.log({ actionPlayer: data });
        // console.log({ gameState: room.gameState });
        // console.log({ actionCount: room.actionCount });
        // console.log({ allPasses });
        // console.log({ currentTurnPlayer: room.currentPlayer.name });
        // console.log({
        //   currentPlayerSelectedCards: room.currentPlayer.selectedCards,
        // });
        // console.log({ currentPlayerAction: room.currentPlayer.action });

        if (allPasses && room.currentPlayer.action !== 'submit') {
          if (room.gameState === 'starting') {
            this.io.to(roomId).emit('update room info', {
              playable: true,
              action: `${room.currentPlayer.name}, mời đánh một con để bắt đầu`,
              enableSubmit: 0,
              enablePass: 0,
              deselectCards: false,
            });
          } else if (
            room.gameState === 'next' ||
            room.gameState === 'meld' ||
            (room.gameState === 'drawing' &&
              room.currentPlayer.action === 'pass')
          ) {
            // room.gameState = 'drawing from deck';
            room.currentPlayer = room.currentPlayer.adjacentPlayer;
            this.io.to(roomId).emit('update room info', {
              playable: 0,
              drawable: Date.now(),
              action: `${room.currentPlayer.name}, mời bốc một con để tiếp tục`,
              turnPlayerName: room.currentPlayer.name,
              enableSubmit: 0,
              enablePass: 0,
              deselectCards: false,
            });
          } else if (room.gameState === 'drawing') {
          }
          room.gameState = 'next';
          room.actionCount = 4;
          room.turnRank = -1;
          room.players.forEach((player) => (player.action = null));

          return;
        }

        if (room.actionCount === 0) {
          // if (room.gameState === 'drawing') {
          //   room.gameState = 'next';
          //   this.io.to(roomId).emit('update room info', {
          //     playable: true,
          //     action: `${room.currentPlayer.name}, mời bốc hoặc đánh ra một con để tiếp tục`,
          //     currentPlayerFinalCard: null,
          //     turnPlayerName: room.currentPlayer.name,
          //     ...room.toJSON(),
          //     enableSubmit: 0,
          //     enablePass: 0,
          //     deselectCards: true,
          //   });

          //   room.actionCount = 4;
          //   room.turnRank = -1;
          //   room.players.forEach((player) => (player.action = null));
          // }

          room.gameState = 'meld';

          if (room.turnRank === -1) {
            room.currentPlayer = room.currentPlayer.adjacentPlayer;
          }

          // this.io.to(roomId).emit('update room info', {
          //   playable: true,
          //   action: `${room.currentPlayer.name}, place a card to continue`,
          //   turnPlayerName: room.currentPlayer.name,
          //   enableSubmit: 0,
          //   enablePass: 0,
          // });

          room.currentPlayer.tempMelded = false;
          room.removeCurrentPlayerDiscardedCard = false;

          room.currentPlayer.selectedCards.forEach((card) => {
            const cardIdx = room.currentPlayer.cards.findIndex(
              (c) => c.character === card.character && c.color === card.color
            );
            if (cardIdx > -1) {
              room.currentPlayer.cards.splice(cardIdx, 1);
            }
          });

          otherPlayers = room.players.filter(
            (player) => player.name !== room.currentPlayer.name
          );

          otherPlayers.forEach((player) => {
            if (player.tempMelded) {
              player.melded.pop();
              player.tempMelded = false;
            }
          });

          room.players.forEach((player) => {
            this.io.to(player.socketId).emit('update player info', {
              cards: player.cards,
              melded: player.melded,
              discarded: player.discarded,
            });
          });

          this.io.to(roomId).emit('update room info', {
            playable: true,
            action: `${room.currentPlayer.name} ăn ${
              CHARACTERS[room.currentPlayerFinalCard.character]
            } ${
              COLORS[room.currentPlayerFinalCard.color]
            }. Mời đánh ra một con để tiếp tục`,
            currentPlayerFinalCard: null,
            turnPlayerName: room.currentPlayer.name,
            ...room.toJSON(),
            enableSubmit: 0,
            enablePass: 0,
            deselectCards: Date.now(),
          });

          room.actionCount = 4;
          room.turnRank = -1;
          room.players.forEach((player) => (player.action = null));
        }
      }
    };
  }

  checkForStraight(room, selectedCards, currentPlayerFinalCard) {
    room.turnResult = -1;
    if (currentPlayerFinalCard.character === 'soldier') {
      if (selectedCards.every((card) => card.character === 'soldier')) {
        const check = new Set();
        check.add(currentPlayerFinalCard.color);
        selectedCards.forEach((card) => check.add(card.color));
        room.turnResult = check.size === selectedCards.length + 1 ? 1 : -1;
      }
    } else {
      if (
        selectedCards.every(
          (card) => card.color === currentPlayerFinalCard.color
        )
      ) {
        const straight = [];
        straight.push(currentPlayerFinalCard.character);
        selectedCards.forEach((card) => straight.push(card.character));
        const straightStr = JSON.stringify(straight.sort());
        if (straightStr === STRAIGHT_1 || straightStr === STRAIGHT_2) {
          room.turnResult = 1;
        }
      }
    }
  }
}

module.exports = EventHandler;
