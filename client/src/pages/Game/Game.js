import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Deck from '../../components/Deck/Deck';
import GameAction from '../../components/GameAction/GameAction';
import Graveyard from '../../components/Graveyard/Graveyard';
import Hand from '../../components/Hand/Hand';
import OpponentHand from '../../components/OpponentHand/OpponentHand';
import Melded from '../../components/Melded/Melded';
import styles from './Game.module.css';

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

const Game = () => {
  return (
    <div className={styles.container}>
      <Row noGutters className={styles.top}>
        <OpponentHand position="top" player={players[1]} />
      </Row>
      <Row noGutters className={styles.mid}>
        <Col xl="2" className={styles['mid-left']}>
          <OpponentHand position="left" player={players[3]} />
        </Col>
        <Col xl="8" className={styles['mid-center']}>
          <Row noGutters className={styles['mid-center-row']}>
            <Col col="3" className={styles['graveyard left']}>
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
            <Col
              col="3"
              className={`${styles['graveyard']} ${styles['right']}`}
            >
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
        <Col xl="2" className={styles['mid-right']}>
          <OpponentHand position="right" player={players[2]} />
        </Col>
      </Row>
      <Row noGutters className={`${styles.bottom} justify-content-between`}>
        <div className="hand">
          <Hand cards={hand.slice(0, 21)} melded={players[0].melded} />
        </div>
        <div className="melded">
          <Melded groupOfCards={players[0].melded} position="bottom" />
        </div>
      </Row>
    </div>
  );
};

export default Game;
