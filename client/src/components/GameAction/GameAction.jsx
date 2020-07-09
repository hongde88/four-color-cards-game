import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../Card/Card';
import styles from './GameAction.module.css';
import Alert from 'react-bootstrap/alert';
import Button from 'react-bootstrap/button';
import { setRoomCurrentPlayerFinalCard } from '../../store/actions/room';

const GameAction = ({ card, state }) => {
  let content;
  const dispatch = useDispatch();
  const action = useSelector((state) => state.room.room.action);
  const gameState = useSelector((state) => state.room.room.gameState);
  const turnPlayerName = useSelector((state) => state.room.room.turnPlayerName);
  const clientPlayer = useSelector((state) => state.player.player);
  const clientCards = useSelector((state) => state.player.cards);
  const currentPlayerSelectedCard = useSelector(
    (state) => state.room.room.currentPlayerSelectedCard
  );

  const onPlayClick = () => {
    if (currentPlayerSelectedCard) {
      const selectedCardIdx = clientCards.cards.findIndex(
        (card) =>
          card.character === currentPlayerSelectedCard.character &&
          card.color === currentPlayerSelectedCard.color
      );

      if (selectedCardIdx !== -1) {
        dispatch(
          setRoomCurrentPlayerFinalCard({
            currentPlayerCards: clientCards.cards,
            currentPlayerFinalCard: currentPlayerSelectedCard,
            currentPlayerFinalCardIdx: selectedCardIdx,
          })
        );
      }
    }
  };

  switch (state) {
    case 'choose':
      content = (
        <>
          {action && (
            <Alert variant="info" size="sm">
              {action}
            </Alert>
          )}
          {card && <Card card={card} size="lg" />}
          <div className={styles.buttonContainer}>
            <Button>Đôi</Button>
            <Button>Khui</Button>
            <Button>Tới</Button>
            <Button>Đặt khàn</Button>
            <Button
              style={{
                opacity:
                  clientPlayer &&
                  clientPlayer.name === turnPlayerName &&
                  gameState !== 'starting'
                    ? 1
                    : 0.4,
                pointerEvents:
                  clientPlayer && clientPlayer.name === turnPlayerName
                    ? 'initial'
                    : 'none',
              }}
            >
              Bốc
            </Button>
            <Button
              style={{
                opacity:
                  clientPlayer && clientPlayer.name === turnPlayerName
                    ? 1
                    : 0.4,
                pointerEvents:
                  clientPlayer && clientPlayer.name === turnPlayerName
                    ? 'initial'
                    : 'none',
              }}
              onClick={onPlayClick}
            >
              Đánh
            </Button>
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
  cardPlayed: PropTypes.object,
  state: PropTypes.string.isRequired,
};

export default GameAction;
