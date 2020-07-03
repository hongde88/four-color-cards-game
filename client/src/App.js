import React from 'react';
import './App.css';
import Deck from './components/Deck/Deck';
import GameAction from './components/GameAction/GameAction';
import Hand from './components/Hand/Hand';
import OpponentHand from './components/OpponentHand/OpponentHand';

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
  { name: 'Ly', index: 0 },
  { name: 'Duc', index: 3 },
  { name: 'Mic', index: 1 },
  { name: 'Hoa', index: 2 },
];

function App() {
  return (
    <>
      <OpponentHand cardsLeft={20} position="top" player={players[1]} />
      <OpponentHand cardsLeft={20} position="left" player={players[2]} />
      <OpponentHand cardsLeft={20} position="right" player={players[3]} />
      <div className="main-content">
        <div className="inner-content">
          <div className="chat">Chat placeholder</div>
          <div>
            <Deck remaining={112 - 80} />
            <GameAction
              hand={hand.slice(0, 20)}
              card={hand[20]}
              state={'choose'}
            />
          </div>
        </div>
        <Hand hand={hand.slice(0, 20)} />
      </div>
    </>
  );
}

export default App;
