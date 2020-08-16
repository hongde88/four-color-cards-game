import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Deck from '../../components/Deck/Deck';
import GameAction from '../../components/GameAction/GameAction';
import Graveyard from '../../components/Graveyard/Graveyard';
import Hand from '../../components/Hand/Hand';
import OpponentHand from '../../components/OpponentHand/OpponentHand';
import Melded from '../../components/Melded/Melded';
import styles from './Game.module.css';

const Game = () => {
  const roomPlayers = useSelector((state) => state.room.room.players);
  const clientPlayer = useSelector((state) => state.player.player);
  const clientCards = useSelector((state) => state.player.cards);
  const cardsRemainingInDeck = useSelector(
    (state) => state.room.room.cardsRemainingInDeck
  );
  const currentPlayerFinalCard = useSelector(
    (state) => state.room.room.currentPlayerFinalCard
  );
  const [seats, setSeats] = useState(null);

  useEffect(() => {
    // if (roomPlayers.length === 4) {
    const player = roomPlayers.find((p) => p.name === clientPlayer.name);
    const rightSeatName = player.adjacentPlayer;
    const rightSeatPlayer = roomPlayers.find(
      (player) => player.name === rightSeatName
    );
    const topSeatName = rightSeatPlayer.adjacentPlayer;
    const topSeatPlayer = roomPlayers.find(
      (player) => player.name === topSeatName
    );
    const leftSeatName = topSeatPlayer.adjacentPlayer;
    const leftSeatPlayer = roomPlayers.find(
      (player) => player.name === leftSeatName
    );

    setSeats({
      left: leftSeatPlayer,
      top: topSeatPlayer,
      right: rightSeatPlayer,
    });
  }, [roomPlayers]);

  return (
    <div className={styles.container}>
      <Row noGutters className={styles.top}>
        {seats && <OpponentHand position="top" player={seats.top} />}
      </Row>
      <Row noGutters className={styles.mid}>
        <Col xl="2" className={styles['mid-left']}>
          {seats && <OpponentHand position="left" player={seats.left} />}
        </Col>
        <Col xl="8" className={styles['mid-center']}>
          <Row noGutters className={styles['mid-center-row']}>
            <Col col="3" className={styles['graveyard left']}>
              {seats && (
                <Graveyard cards={seats.top.discarded} position={'top-left'} />
              )}
              <Deck remaining={cardsRemainingInDeck} />
              {seats && (
                <Graveyard
                  cards={seats.left.discarded}
                  position={'bottom-left'}
                />
              )}
            </Col>
            <Col col="6">
              <GameAction card={currentPlayerFinalCard} state={'choose'} />
            </Col>
            <Col
              col="3"
              className={`${styles['graveyard']} ${styles['right']}`}
            >
              {seats && (
                <Graveyard
                  cards={seats.right.discarded}
                  position={'top-right'}
                />
              )}
              <Graveyard
                cards={clientCards.discarded}
                position={'bottom-right'}
              />
            </Col>
          </Row>
        </Col>
        <Col xl="2" className={styles['mid-right']}>
          {seats && <OpponentHand position="right" player={seats.right} />}
        </Col>
      </Row>
      <Row noGutters className={`${styles.bottom} justify-content-between`}>
        <div className={styles.hand}>
          {clientCards.cards.length > 0 ? (
            <Hand key={clientCards.cards.length} cards={clientCards.cards} />
          ) : null}
        </div>
        <div className={styles.melded}>
          <Melded groupOfCards={clientCards.melded} position="bottom" />
        </div>
      </Row>
    </div>
  );
};

export default Game;
