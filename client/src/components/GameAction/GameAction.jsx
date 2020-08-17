import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../Card/Card';
import styles from './GameAction.module.css';
import Alert from 'react-bootstrap/alert';
import Button from 'react-bootstrap/button';
import { setRoomCurrentPlayerFinalCard } from '../../store/actions/room';
import { sendPlayerAction } from '../../store/actions/player';

const GameAction = ({ card, state }) => {
  let content;
  const dispatch = useDispatch();
  const action = useSelector((state) => state.room.room.action);
  // const gameState = useSelector((state) => state.room.room.gameState);
  const gamePlayable = useSelector((state) => state.room.room.playable);
  const gameDrawable = useSelector((state) => state.room.room.drawable);
  const gameState = useSelector((state) => state.room.room.gameState);
  const turnPlayerName = useSelector((state) => state.room.room.turnPlayerName);
  const clientPlayer = useSelector((state) => state.player.player);
  const clientCards = useSelector((state) => state.player.cards);
  const playerSelectedCards = useSelector(
    (state) => state.player.player.selectedCards
  );
  const [clientAction, setClientAction] = useState(null);
  const playerError = useSelector((state) => state.player.errors.message);
  const enableSubmit = useSelector((state) => state.room.room.enableSubmit);
  const enablePass = useSelector((state) => state.room.room.enablePass);

  useEffect(() => {
    if (playerError) {
      setClientAction(playerError);
    }
  }, [playerError]);

  useEffect(() => {
    const submitBtn = document.getElementById('submitBtn');
    const passBtn = document.getElementById('passBtn');
    const playBtn = document.getElementById('playBtn');
    const drawBtn = document.getElementById('drawBtn');

    if (submitBtn) {
      submitBtn.style.opacity = enableSubmit ? 1 : 0.4;
      submitBtn.style.pointerEvents = enableSubmit ? 'initial' : 'none';
    }

    if (passBtn) {
      passBtn.style.opacity = enablePass ? 1 : 0.4;
      passBtn.style.pointerEvents = enablePass ? 'initial' : 'none';
    }

    if (playBtn) {
      playBtn.style.opacity = gamePlayable ? 1 : 0.4;
      playBtn.style.pointerEvents = gamePlayable ? 'initial' : 'none';
    }

    if (drawBtn) {
      drawBtn.style.opacity = gameDrawable ? 1 : 0.4;
      drawBtn.style.pointerEvents = gameDrawable ? 'initial' : 'none';
    }

    // if (enableSubmit && enablePass) {
    //   const submitPassContainer = document.getElementById(
    //     'submitPassContainer'
    //   );
    //   if (submitPassContainer) {
    //     submitPassContainer.style.opacity = 1;
    //     submitPassContainer.style.pointerEvents = 'initial';
    //   }
    // }

    // if (gamePlayable || gameDrawable) {
    //   const drawPlayContainer = document.getElementById('drawPlayContainer');
    //   if (drawPlayContainer) {
    //     drawPlayContainer.style.opacity = 1;
    //     drawPlayContainer.style.pointerEvents = 'initial';
    //   }
    // }
  }, [enableSubmit, enablePass, gameDrawable, gamePlayable]);

  const onPlayClick = () => {
    if (playerSelectedCards.length === 0) {
      setClientAction('Please select a card to play');
    } else if (playerSelectedCards.length > 1) {
      setClientAction('Please select only one card to play');
    } else {
      const selectedCardIdx = clientCards.cards.findIndex(
        (card) =>
          card.character === playerSelectedCards[0].character &&
          card.color === playerSelectedCards[0].color
      );

      if (selectedCardIdx !== -1) {
        const playBtn = document.getElementById('playBtn');
        const drawBtn = document.getElementById('drawBtn');
        playBtn.style.opacity = 0.4;
        playBtn.style.pointerEvents = 'none';
        playBtn.blur();
        drawBtn.style.opacity = 0.4;
        drawBtn.style.pointerEvents = 'none';
        drawBtn.blur();
        dispatch(
          setRoomCurrentPlayerFinalCard({
            currentPlayerCards: clientCards.cards,
            currentPlayerFinalCard: playerSelectedCards[0],
            currentPlayerFinalCardIdx: selectedCardIdx,
          })
        );
        setClientAction(null);
      }
    }
  };

  const onDrawClick = () => {
    const playBtn = document.getElementById('playBtn');
    const drawBtn = document.getElementById('drawBtn');
    playBtn.style.opacity = 0.4;
    playBtn.style.pointerEvents = 'none';
    playBtn.blur();
    drawBtn.style.opacity = 0.4;
    drawBtn.style.pointerEvents = 'none';
    drawBtn.blur();
    dispatch(
      sendPlayerAction({
        playerAction: 'draw',
      })
    );
  };

  const onSubmitOrPassClick = (playerAction) => {
    const submitBtn = document.getElementById('submitBtn');
    const passBtn = document.getElementById('passBtn');
    submitBtn.style.opacity = 0.4;
    submitBtn.style.pointerEvents = 'none';
    submitBtn.blur();
    passBtn.style.opacity = 0.4;
    passBtn.style.pointerEvents = 'none';
    passBtn.blur();
    dispatch(
      sendPlayerAction({
        playerSelectedCards,
        playerAction,
        playerCards: clientCards,
      })
    );

    // if (playerAction === 'submit') {
    //   dispatch(
    //     removePlayerSelectedCard({
    //       playerDeselectedCard: Array.isArray(playerSelectedCards)
    //         ? playerSelectedCards
    //         : [playerSelectedCards],
    //     })
    //   );
    // }
  };

  const onFourKindSubmissionClick = () => {
    if (playerSelectedCards.length !== 4) {
      setClientAction('Không phải Thiên');
    } else {
      dispatch(
        sendPlayerAction({
          playerSelectedCards,
          playerAction: 'fourkind',
          playerCards: clientCards,
        })
      );
    }
  };

  const onThreeKindSubmissionClick = () => {
    if (playerSelectedCards.length !== 3) {
      setClientAction('Không phải Khàn');
    } else {
      dispatch(
        sendPlayerAction({
          playerSelectedCards,
          playerAction: 'threekind',
        })
      );
    }
  };

  switch (state) {
    case 'choose':
      content = (
        <>
          {action && (
            <Alert variant="info" size="sm">
              {clientAction || action}
            </Alert>
          )}
          {card && <Card card={card} size="lg" />}
          {clientPlayer && clientPlayer.name === turnPlayerName ? (
            <div id="drawPlayContainer" className={styles.buttonContainer}>
              <Button
                id="drawBtn"
                // style={{
                //   opacity: gameDrawable ? 1 : 0.4,
                //   pointerEvents: gameDrawable ? 'initial' : 'none',
                // }}
                onClick={onDrawClick}
              >
                Bốc
              </Button>
              <Button
                id="playBtn"
                // style={{
                //   opacity: gamePlayable ? 1 : 0.4,
                //   pointerEvents: gamePlayable ? 'initial' : 'none',
                // }}
                onClick={onPlayClick}
              >
                Đánh
              </Button>
              {gameState === 'drawing' && (
                <Button
                  id="submitBtn"
                  // style={{
                  //   opacity: enableSubmit ? 1 : 0.4,
                  //   pointerEvents: enableSubmit ? 'initial' : 'none',
                  // }}
                  onClick={() => onSubmitOrPassClick('submit')}
                >
                  Ăn
                </Button>
              )}
              {gameState === 'drawing' && (
                <Button
                  id="passBtn"
                  // style={{
                  //   opacity: enablePass ? 1 : 0.4,
                  //   pointerEvents: enablePass ? 'initial' : 'none',
                  // }}
                  onClick={() => onSubmitOrPassClick('pass')}
                >
                  Bỏ Qua
                </Button>
              )}
            </div>
          ) : (
            <div id="submitPassContainer" className={styles.buttonContainer}>
              <Button
                id="submitBtn"
                // style={{
                //   opacity: enableSubmit ? 1 : 0.4,
                //   pointerEvents: enableSubmit ? 'initial' : 'none',
                // }}
                onClick={() => onSubmitOrPassClick('submit')}
              >
                Ăn
              </Button>
              <Button
                id="passBtn"
                // style={{
                //   opacity: enablePass ? 1 : 0.4,
                //   pointerEvents: enablePass ? 'initial' : 'none',
                // }}
                onClick={() => onSubmitOrPassClick('pass')}
              >
                Bỏ Qua
              </Button>
            </div>
          )}
          <div className={styles.buttonContainer}>
            <Button id="fourkindBtn" onClick={onFourKindSubmissionClick}>
              Trình Thiên
            </Button>
            <Button id="threekindBtn" onClick={onThreeKindSubmissionClick}>
              Đặt Khàn
            </Button>
            <Button id="winBtn">Tới</Button>
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
