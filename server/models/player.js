class Player {
  constructor(name, avatarIndex, socketId, cards, meldedCards, discardedCards) {
    this.name = name;
    this.avatarIndex = avatarIndex;
    this.socketId = socketId;
    this.cards = cards;
    this.melded = meldedCards;
    this.discarded = discardedCards;
    this.selectedCards = [];
    this.priorityCard = null;
    this.priority = null;
    this.seatCard = null;
    this.adjacentPlayer = null;
    this.action = null;
    this.balance = 100;
  }

  toJSON() {
    return {
      name: this.name,
      avatarIndex: this.avatarIndex,
      cardsRemaining: this.cards.length,
      priorityCard: this.priorityCard,
      priority: this.priority,
      melded: this.melded,
      discarded: this.discarded,
      adjacentPlayer: this.adjacentPlayer
        ? this.adjacentPlayer.name
        : this.adjacentPlayer,
      action: this.action,
    };
  }
}

class AIPlayer extends Player {
  constructor(name, avatarIndex, cards, meldedCards, discardedCards) {
    super(name, avatarIndex, cards, meldedCards, discardedCards);
  }

  play() {}
}

module.exports = { Player, AIPlayer };
