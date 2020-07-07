import PropTypes from 'prop-types';
import React from 'react';
import Card from '../Card/Card';
import styles from './GameAction.module.css';
import Alert from 'react-bootstrap/alert';
import Button from 'react-bootstrap/button';

const GameAction = ({ hand, card, state }) => {
  let content;

  switch (state) {
    case 'choose':
      content = (
        <>
          <Alert variant="info" size="sm">
            Game action
          </Alert>
          <Card card={card} />
          <div className={styles.buttonContainer}>
            <Button>Đôi</Button>
            <Button>Khui</Button>
            <Button>Tới</Button>
            <Button>Đặt khàn</Button>
            <Button>Bốc</Button>
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
