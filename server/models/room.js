const Player = require('./player').Player;
const Card = require('./card');
const cardsForSeatSelection = Symbol('cardsForSeatSelection');

class Room {
  static UNIQUE_CARDS = Room.generateUniqueCards();

  constructor(roomId) {
    this.roomId = roomId;
    this.host = null;
    this.players = [];
    this.currentPlayer = null;
    this.gameState = null;
    this.gameStarted = null;
    this[cardsForSeatSelection] = [
      new Card('general', 'green', 0),
      new Card('general', 'yellow', 1),
      new Card('general', 'red', 2),
      new Card('general', 'white', 3),
    ];
    this.deckOfCards = this.generateDeckOfCards();
    this.priorities = [];
    this.currentSeatPickerIdx = null;
    this.currentSeatPicker = null;
    this.seats = {
      green: null,
      yellow: null,
      red: null,
      white: null,
    };
    this.currentPlayerSelectedCard = null;
    this.currentPlayerFinalCard = null;
    this.cardsRemainingInDeck = this.deckOfCards.length;
    this.playable = false;
    this.shuffle(this.deckOfCards);
    this.actionCount = 4;
    this.turnRank = -1;
  }

  generateDeckOfCards() {
    const cards = [];
    const totalCards = Card.CHARACTERS.length * Card.COLORS.length * 4;
    let cardIdx = totalCards;
    let idx = 0;
    Card.CHARACTERS.forEach((character) =>
      Card.COLORS.forEach((color) => {
        for (let i = 0; i < 4; i++) {
          cards.push(new Card(character, color, totalCards - idx, cardIdx--));
        }
        idx++;
      })
    );
    return cards;
  }

  static generateUniqueCards() {
    const cards = [];
    const totalCards = Card.CHARACTERS.length * Card.COLORS.length * 4;
    let idx = 0;
    Card.CHARACTERS.forEach((character) =>
      Card.COLORS.forEach((color) => {
        cards.push(new Card(character, color, totalCards - idx));
        idx++;
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
    if (this.players.length >= 4) {
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

  // inclusive min, exclusive max [min, max)
  getARandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getARandomCard() {
    const min = 0;
    const max = Room.UNIQUE_CARDS.length;

    let randomIdx = null;
    let randomCard = null;

    do {
      randomIdx = this.getARandomNumberInRange(min, max);
      randomCard = Room.UNIQUE_CARDS[randomIdx];
    } while (
      this.priorities.find((player) => randomCard.equals(player.priorityCard))
    );

    return randomCard;
  }

  getARandomCardForSeatSelection() {
    const min = 0;
    const max = this[cardsForSeatSelection].length;
    const randomIdx = this.getARandomNumberInRange(min, max);
    const card = this[cardsForSeatSelection].splice(randomIdx, 1);
    return card[0];
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

  dealGoodPiles() {
    let piles = this.deal();

    while (!this.validateGoodPiles(piles)) {
      this.deckOfCards = this.generateDeckOfCards();
      this.shuffle(this.deckOfCards);
      piles = this.deal();
    }

    return piles;
  }

  validateGoodPiles(piles) {
    return piles.every((pile) => {
      const map = {};
      pile.forEach((card) => {
        if (map[`${card.character}_${card.color}`]) {
          map[`${card.character}_${card.color}`]++;
        } else {
          map[`${card.character}_${card.color}`] = 1;
        }
      });

      let threeKindCount = 0;
      let fourKindCount = 0;
      Object.keys(map).forEach((key) => {
        if (map[key] === 3) threeKindCount++;
        if (map[key] === 4) fourKindCount++;
      });

      return threeKindCount + fourKindCount < 4;
    });
  }

  toJSON() {
    return {
      roomId: this.roomId,
      host: this.host,
      players: this.players,
      gameState: this.gameState,
      currentSeatPicker: this.currentSeatPicker,
      seats: this.seats,
      cardsRemainingInDeck: this.deckOfCards.length,
      gameStarted: this.gameStarted,
    };
  }
}

module.exports = Room;
