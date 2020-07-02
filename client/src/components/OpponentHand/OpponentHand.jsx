import React from 'react';
import CardBack from '../CardBack/CardBack';
import PropTypes from 'prop-types';
import styles from './OpponentHand.module.css';

const OpponentHand = ({ cardsLeft, position }) => {
  const hand = [];

  const degree = position === 'top' ? 270 : 180;
  const negative = position === 'right' ? -1 : 1;

  for (let i = 0; i < 19; i++) {
    hand.push(<CardBack key={i} degree={degree + 10 * i * negative} />);
  }

  return (
    <div className={styles[`${position}Hand`]}>
      {hand}
      <div className={styles.cardsLeftText}>{cardsLeft}</div>
    </div>
  );
};

OpponentHand.propTypes = {
  cardsLeft: PropTypes.number.isRequired,
  position: PropTypes.string.isRequired,
};

export default OpponentHand;
