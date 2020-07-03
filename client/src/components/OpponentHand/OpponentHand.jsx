import React from 'react';
import CardBack from '../CardBack/CardBack';
import PropTypes from 'prop-types';
import styles from './OpponentHand.module.css';
import Avatar from '../Avatar/Avatar';

const OpponentHand = ({ cardsLeft, position, player }) => {
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
      <Avatar name={player.name} index={player.index} small={true} />
    </div>
  );
};

OpponentHand.propTypes = {
  cardsLeft: PropTypes.number.isRequired,
  position: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
};

export default OpponentHand;
