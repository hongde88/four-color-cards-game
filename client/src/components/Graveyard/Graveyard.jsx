import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styles from './Graveyard.module.css';

const Graveyard = ({ cards, position }) => {
  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {cards.map((card, index) => {
        const row = Math.floor(index / 8);
        const column = index % 8;
        return (
          <Card
            key={`card_${position}_${index}`}
            card={card}
            size="md"
            absolute={true}
            marginLeft={25 * column}
            marginTop={50 * row}
          />
        );
      })}
    </div>
  );
};

Graveyard.defaultProps = {
  cards: [],
};

Graveyard.propTypes = {
  cards: PropTypes.array,
  position: PropTypes.string.isRequired,
};

export default Graveyard;
