const Player = require('./player').Player;
const Card = require('./card');

class Room {
  static DECK_OF_CARDS = Room.generateDeckOfCards();

  constructor(roomId) {
    this.roomId = roomId;
    this.host = null;
    this.players = [];
    this.currentPlayerIdx = 0;
    this.gameState = null;
    this.deckOfCards = Room.DECK_OF_CARDS;
    this.shuffle(this.deckOfCards);
  }

  static generateDeckOfCards() {
    const cards = [];
    let idx = 0;
    Card.CHARACTERS.forEach((character) =>
      Card.COLORS.forEach((color) => {
        for (let i = 0; i < 4; i++) {
          cards.push(new Card(character, color, idx++));
        }
      })
    );
    return cards;
  }

  shuffle(cards) {
    let currentCardIdx = cards.length;
    let randomCardIdx, tempCard;
    while (--currentCardIdx > 0) {
      randomCardIdx = Math.floor(Math.random() * (currentCardIdx + 1));
      tempCard = cards[randomCardIdx];
      cards[randomCardIdx] = cards[currentCardIdx];
      cards[currentCardIdx] = tempCard;
    }
  }

  acceptPlayer(name, avatarIdx, socketId) {
    if (this.players.length > 4) {
      return false;
    } else {
      if (this.players.length === 0) {
        // create the host
        this.host = name;
      }
      this.players.push(new Player(name, avatarIdx, socketId, [], [], []));
      return true;
    }
  }

  removePlayer(name) {
    let removedPlayer = null;

    const removedPlayerIdx = this.players.findIndex(
      (player) => player.name === name
    );

    if (removedPlayerIdx > -1) {
      removedPlayer = this.players.splice(removedPlayerIdx, 1);
      this.numPlayers--;
    }

    return removedPlayer;
  }

  updateGameState(state) {
    this.gameState = state;
  }

  getARandomCard() {
    const min = 0;
    const max = this.deckOfCards.length;
    const randomIdx = Math.floor(Math.random() * (max - min)) + min;
    return this.deckOfCards[randomIdx];
  }

  deal() {
    const piles = [[], [], [], []];

    piles[0].push(...this.deckOfCards.splice(0, 1));
    for (let round = 0; round < 4; round++) {
      piles[0].push(...this.deckOfCards.splice(0, 5));
      piles[1].push(...this.deckOfCards.splice(0, 5));
      piles[2].push(...this.deckOfCards.splice(0, 5));
      piles[3].push(...this.deckOfCards.splice(0, 5));
    }

    return piles;
  }
}

module.exports = Room;