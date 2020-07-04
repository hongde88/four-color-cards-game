import React from 'react';
import './App.css';
import Deck from './components/Deck/Deck';
import GameAction from './components/GameAction/GameAction';
import Hand from './components/Hand/Hand';
import Opponents from './components/Opponents/Opponents';
import Graveyards from './components/Graveyards/Graveyards';
import MeldedPositions from './components/MeldedPositions/MeldedPositions';

const CHARACTERS = [
  'general',
  'advisor',
  'bishop',
  'rook',
  'cannon',
  'horse',
  'soldier',
];

const COLORS = ['green', 'red', 'yellow', 'white'];

const hand = [];
CHARACTERS.forEach((character) =>
  COLORS.forEach((color) => {
    for (let i = 0; i < 4; i++) {
      hand.push({ character, color });
    }
  })
);
hand.sort(() => Math.random() - 0.5);

const players = [
  {
    name: 'Ly',
    index: 0,
    cardsRemaining: 20,
    melded: [
      [
        { color: 'green', character: 'general' },
        { color: 'green', character: 'general' },
        { color: 'green', character: 'general' },
        { color: 'green', character: 'general' },
      ],
      [
        { color: 'yellow', character: 'general' },
        { color: 'yellow', character: 'advisor' },
        { color: 'yellow', character: 'bishop' },
      ],
    ],
  },
  { name: 'Duc', index: 3, cardsRemaining: 20, melded: [] },
  { name: 'Mic', index: 1, cardsRemaining: 20, melded: [] },
  { name: 'Hoa', index: 2, cardsRemaining: 20, melded: [] },
];

const graveyards = {
  'top-left': [],
  'top-right': [],
  'bottom-right': [],
  'bottom-left': [],
};

function App() {
  return (
    <div className="main-content">
      <Opponents players={players.slice(1, 4)} />
      <div className="inner-content">
        <Deck remaining={112 - 80} />
        <Graveyards graveyards={graveyards} />
        <MeldedPositions players={players} />
        <GameAction hand={hand.slice(0, 20)} card={hand[20]} state={'choose'} />
      </div>
      <div className="hand-container">
        <Hand hand={hand.slice(0, 20)} />
      </div>
    </div>
  );
}

export default App;
