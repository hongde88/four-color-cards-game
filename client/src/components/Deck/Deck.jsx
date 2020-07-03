import React from 'react';
import PropTypes from 'prop-types';
import CardBack from '../CardBack/CardBack';
import styles from './Deck.module.css';

const Deck = ({ remaining }) => {
  const deck = [];
  for (let i = 0; i < 10; i++) {
    deck.push(<CardBack key={i} degree={160 + 3 * i} />);
  }

  return (
    <div className={styles.deckContainer}>
      <div className={styles.remainingText}>{remaining}</div>
      {deck}
    </div>
  );
};

Deck.propTypes = {
  remaining: PropTypes.number.isRequired,
};

export default Deck;
