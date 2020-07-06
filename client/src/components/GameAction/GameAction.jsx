import PropTypes from 'prop-types';
import React from 'react';
import Card from '../Card/Card';
import styles from './GameAction.module.css';

const GameAction = ({ hand, card, state }) => {
  let content;

  switch (state) {
    case 'choose':
      content = (
        <>
          <Card card={card} />
          <div className={styles.buttonContainer}>
            <button>Đôi</button>
            <button>Khui</button>
            <button>Tới</button>
            <button>Đặt khàn</button>
            <button>Bốc</button>
          </div>
        </>
      );
      break;
    default:
      break;
  }

  return <div className={styles.actionContainer}>{content}</div>;
};

GameAction.propTypes = {
  hand: PropTypes.array.isRequired,
  cardPlayed: PropTypes.object,
  state: PropTypes.string.isRequired,
};

export default GameAction;
