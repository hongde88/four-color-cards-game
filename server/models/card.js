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

  static COLORS = ['green', 'red', 'yellow', 'white'];

  constructor(character, color, index) {
    this.character = character;
    this.color = color;
    this.index = index;
  }

  toJSON() {
    return {
      character: this.character,
      color: this.color,
      index: this.index,
    };
  }
}

module.exports = Card;
