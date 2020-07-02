import React from 'react';
import './App.css';
import Card from './components/Card/Card';
import Hand from './components/Hand/Hand';
import OpponentHand from './components/OpponentHand/OpponentHand';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GameAction from './components/GameAction/GameAction';

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

function App() {
  return (
    <>
      <OpponentHand cardsLeft={20} position="top" />
      <OpponentHand cardsLeft={20} position="left" />
      <OpponentHand cardsLeft={20} position="right" />
      <div className="main-content">
        <div className="inner-content">
          <div className="chat">Chat placeholder</div>
          <GameAction
            hand={hand.slice(0, 20)}
            card={hand[20]}
            state={'choose'}
          />
        </div>
        <Hand hand={hand.slice(0, 20)} />
      </div>
    </>
  );
}

export default App;
