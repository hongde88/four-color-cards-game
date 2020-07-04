import PropTypes from 'prop-types';
import React from 'react';
import Card from '../Card/Card';
import Melded from '../Melded/Melded';
import styles from './Hand.module.css';

const Hand = ({ hand, melded, opponent }) => {
  return (
    <div className={styles.myHand}>
      <Melded groupOfCards={melded} position="bottom" />
      <div
        className={`${styles.handContainer} ${
          opponent ? styles.opponentHand : styles.myHand
        }`}
      >
        {hand.map((card, index) => (
          <Card key={`card${index}`} card={card} />
        ))}
      </div>
    </div>
  );
};

Hand.defaultProps = {
  opponent: false,
};

Hand.propTypes = {
  hand: PropTypes.array.isRequired,
  melded: PropTypes.array.isRequired,
  opponent: PropTypes.bool,
};

export default Hand;
