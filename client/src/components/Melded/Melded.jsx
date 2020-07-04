import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styles from './Melded.module.css';

const Melded = ({ groupOfCards, position }) => {
  let marginLeft = 0;

  const isLeftOrRight = position === 'left' || position === 'right';

  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {groupOfCards.map((cards, groupIndex) => {
        marginLeft += isLeftOrRight ? 0 : groupIndex === 0 ? 0 : 50;
        return (
          <div key={`group_${groupIndex}`} className={`${styles.group}`}>
            {cards.map((card, cardIndex) => {
              marginLeft += cardIndex === 0 ? 0 : 20;
              return (
                <div
                  key={`card_${position}_${cardIndex}`}
                  style={{
                    zIndex: -1 - cardIndex,
                    position: 'absolute',
                    marginLeft: isLeftOrRight ? cardIndex * 20 : marginLeft,
                    marginTop: isLeftOrRight ? groupIndex * 50 : 0,
                  }}
                >
                  <Card card={card} size="small" />
                </div>
              );
            })}
          </div>
        );
      })}
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
