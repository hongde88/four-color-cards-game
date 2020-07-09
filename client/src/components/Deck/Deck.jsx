import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styles from './Deck.module.css';

const Deck = ({ remaining }) => {
  const deck = [];
  for (let i = 0; i < 10; i++) {
    deck.push(<Card key={i} degree={160 + 3 * i} size="sm" absolute={true} />);
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
