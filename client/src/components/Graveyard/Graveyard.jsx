import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styles from './Graveyard.module.css';

const Graveyard = ({ cards, position }) => {
  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {cards.map((card, index) => {
        const row = Math.floor(index / 9);
        const column = index % 9;
        return (
          <div
            key={`card_${position}_${index}`}
            style={{
              position: 'absolute',
              marginLeft: 25 * column,
              marginTop: 50 * row,
            }}
          >
            <Card card={card} size="small" />
          </div>
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
