import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styles from './Hand.module.css';

const Hand = ({ hand, opponent }) => {
  return (
    <div
      className={`${styles.handContainer} ${
        opponent ? styles.opponentHand : styles.myHand
      }`}
    >
      {hand.map((card, index) => (
        <Card key={`card${index}`} card={card} />
      ))}
    </div>
  );
};

Hand.defaultProps = {
  opponent: false,
};

Hand.propTypes = {
  hand: PropTypes.array.isRequired,
  opponent: PropTypes.bool,
};

export default Hand;
