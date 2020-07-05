import React from 'react';
import './App.css';
import Deck from './components/Deck/Deck';
import GameAction from './components/GameAction/GameAction';
import Hand from './components/Hand/Hand';
import Graveyards from './components/Graveyards/Graveyards';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
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
  {
    name: 'Duc',
    index: 3,
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
  {
    name: 'Mic',
    index: 1,
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
  {
    name: 'Hoa',
    index: 2,
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
];

const graveyards = {
  'top-left': [
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
  ],
  'top-right': [
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
  ],
  'bottom-right': [
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
  ],
  'bottom-left': [
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
    { color: 'yellow', character: 'general' },
    { color: 'yellow', character: 'advisor' },
    { color: 'yellow', character: 'bishop' },
  ],
};

function App() {
  const store = configureStore();

  return (
    <Provider store={store}>
      <div className="main-content">
        <OpponentHand position="top" player={players[1]} />
        <div className="inner-content">
          <OpponentHand position="left" player={players[3]} />
          <div className="center-div">
            <Deck remaining={112 - 80} />
            <Graveyards graveyards={graveyards} />
            <GameAction
              hand={hand.slice(0, 20)}
              card={hand[20]}
              state={'choose'}
            />
          </div>
          <OpponentHand position="right" player={players[2]} />
        </div>
        <Hand cards={hand.slice(0, 20)} melded={players[0].melded} />
      </div>
    </Provider>
  );
}

export default App;
