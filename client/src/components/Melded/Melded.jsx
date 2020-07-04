import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styles from './Melded.module.css';

const Melded = ({ groupOfCards, position }) => {
  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {groupOfCards.map((cards, index) => (
        <div className={`${styles.group}`}>
          {cards.map((card) => (
            <Card key={`card_${index}`} card={card} size="small" />
          ))}
        </div>
      ))}
    </div>
  );
};

Melded.defaultProps = {
  groupOfCards: [],
};

Melded.propTypes = {
  groupOfCards: PropTypes.array,
  position: PropTypes.string.isRequired,
};

export default Melded;
