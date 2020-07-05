import React from 'react';
import './App.css';
import Deck from './components/Deck/Deck';
import GameAction from './components/GameAction/GameAction';
import Hand from './components/Hand/Hand';
import Graveyard from './components/Graveyard/Graveyard';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import OpponentHand from './components/OpponentHand/OpponentHand';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Melded from './components/Melded/Melded';

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
      <Row noGutters className="top">
        <OpponentHand position="top" player={players[1]} />
      </Row>
      <Row noGutters className="mid">
        <Col xl="2" className="mid-left">
          <OpponentHand position="left" player={players[3]} />
        </Col>
        <Col xl="8" className="mid-center">
          <Row noGutters className="mid-center-row">
            <Col col="3" className="graveyard left">
              <Graveyard cards={graveyards['top-left']} position={'top-left'} />
              <Deck remaining={112 - 80} />
              <Graveyard
                cards={graveyards['bottom-left']}
                position={'bottom-left'}
              />
            </Col>
            <Col col="6">
              <GameAction
                hand={hand.slice(0, 20)}
                card={hand[20]}
                state={'choose seat'}
              />
            </Col>
            <Col col="3" className="graveyard right">
              <Graveyard
                cards={graveyards['top-right']}
                position={'top-right'}
              />
              <Graveyard
                cards={graveyards['bottom-right']}
                position={'bottom-right'}
              />
            </Col>
          </Row>
        </Col>
        <Col xl="2" className="mid-right">
          <OpponentHand position="right" player={players[2]} />
        </Col>
      </Row>
      <Row noGutters className="bottom justify-content-between">
        <div className="hand">
          <Hand cards={hand.slice(0, 21)} melded={players[0].melded} />
        </div>
        <div className="melded">
          <Melded groupOfCards={players[0].melded} position="bottom" />
        </div>
      </Row>
    </Provider>
  );
}

export default App;
