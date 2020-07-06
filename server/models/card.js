class Card {
  static CHARACTERS = [
    'general',
    'advisor',
    'bishop',
    'rook',
    'cannon',
    'horse',
    'soldier',
  ];

  static COLORS = ['green', 'yellow', 'red', 'white'];

  constructor(character, color, rank) {
    this.character = character;
    this.color = color;
    this.rank = rank;
  }

  equals(otherCard) {
    return (
      otherCard &&
      this.character === otherCard.character &&
      this.color === otherCard.color &&
      this.rank === otherCard.rank
    );
  }

  toJSON() {
    return {
      character: this.character,
      color: this.color,
      rank: this.rank,
    };
  }
}

module.exports = Card;
