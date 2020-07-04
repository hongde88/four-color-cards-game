import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styles from './Graveyard.module.css';

const Graveyard = ({ cards, position }) => {
  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {cards.map((card, index) => (
        <Card key={`card_${index}`} card={card} size="small" />
      ))}
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
