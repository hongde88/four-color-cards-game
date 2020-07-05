import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styles from './GameAction.module.css';
import CardBack from '../CardBack/CardBack';
import { range } from 'lodash';

const GameAction = ({ hand, card, state }) => {
  let content;

  switch (state) {
    case 'choose seat':
    case 'choose priority':
      content = (
        <>
          {state === 'choose seat' ? 'Bốc chỗ' : 'Bốc đi trước'}
          <div className={styles.chooseSeatContainer}>
            {range(4).map((index) => (
              <CardBack key={`back_${index}`} size="lg" />
            ))}
          </div>
        </>
      );
      break;
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
