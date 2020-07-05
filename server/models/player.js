class Player {
  constructor(name, avatarIndex, socketId, cards, meldedCards, discardedCards) {
    this.name = name;
    this.avatarIndex = avatarIndex;
    this.socketId = socketId;
    this.cards = cards;
    this.meldedCards = meldedCards;
    this.discardedCards = discardedCards;
  }
}

class AIPlayer extends Player {
  constructor(name, avatarIndex, cards, meldedCards, discardedCards) {
    super(name, avatarIndex, cards, meldedCards, discardedCards);
  }

  play() {}
}

module.exports = { Player, AIPlayer };