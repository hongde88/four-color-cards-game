import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardBack from '../../components/CardBack/CardBack';
import styles from './Lobby.module.css';
import { range } from 'lodash';
import styled from 'styled-components/macro';
import Avatar from '../../components/Avatar/Avatar';
import Card from '../../components/Card/Card';
import Alert from 'react-bootstrap/Alert';
import {
  playerPickACardForPriority,
  playerPickACardForSeat,
} from '../../store/actions/player';

const Lobby = () => {
  const dispatch = useDispatch();
  const playerName = useSelector((state) => state.player.player.name);
  const gameState = useSelector((state) => state.room.room.gameState);
  const currentSeatPicker = useSelector(
    (state) => state.room.room.currentSeatPicker
  );
  const playerPriorityCard = useSelector(
    (state) => state.player.cards.priorityCard
  );
  const roomId = useSelector((state) => state.room.room.roomId);
  const PLAYERS = useSelector((state) => state.room.room.players);
  const seats = useSelector((state) => state.room.room.seats);
  const seatCards = useSelector((state) => {
    const seatCards = {};
    Object.values(state.room.room.seats).forEach((seat) => {
      if (seat) seatCards[seat.cardForSeatIdx] = seat.cardForSeat;
    });
    return seatCards;
  });

  const pickASeat = (cardForSeatIdx) => {
    dispatch(
      playerPickACardForSeat({
        roomId,
        playerName,
        cardForSeatIdx,
      })
    );
  };

  const updatePriorities = () => {
    dispatch(playerPickACardForPriority({ playerName, roomId }));
  };

  const displayChoosePriority = () => {
    return (
      <div className={styles.table}>
        <h1>Bốc đi trước</h1>
        <div className={styles.priorityCards}>
          {range(30).map((index) => (
            <PriorityCard
              key={index}
              marginLeft={index * 30}
              onClick={updatePriorities}
            >
              <CardBack size="lg" />
            </PriorityCard>
          ))}
        </div>
      </div>
    );
  };

  const displayChooseSeat = () => (
    <div
      style={{
        opacity:
          currentSeatPicker && currentSeatPicker === playerName ? 1 : 0.4,
        pointerEvents:
          currentSeatPicker && currentSeatPicker === playerName
            ? 'initial'
            : 'none',
      }}
      className={styles.table}
    >
      <h1>Bốc chỗ</h1>
      {seats.green === null && <ColoredSquare color={'green'} />}
      {seats.green &&
        createAvatar(seats.green.playerName, seats.green.playerAvatarIndex)}
      <div className={styles.chooseSeatContainer}>
        {seats.white === null && <ColoredSquare color={'white'} />}
        {seats.white &&
          createAvatar(seats.white.playerName, seats.white.playerAvatarIndex)}
        {range(4).map((index) => (
          <div key={index} onClick={() => pickASeat(index)}>
            {!seatCards[index] ? (
              <CardBack
                key={`back_${index}`}
                size="lg"
                disabled={playerName !== currentSeatPicker}
              />
            ) : (
              <Card card={seatCards[index]} size="large" />
            )}
          </div>
        ))}
        {seats.yellow === null && <ColoredSquare color={'yellow'} />}
        {seats.yellow &&
          createAvatar(seats.yellow.playerName, seats.yellow.playerAvatarIndex)}
      </div>
      {seats.red === null && <ColoredSquare color={'red'} />}
      {seats.red &&
        createAvatar(seats.red.playerName, seats.red.playerAvatarIndex)}
    </div>
  );

  const createAvatar = (name, avatarIndex) => {
    return <Avatar name={name} index={avatarIndex} small={true} />;
  };

  const players = PLAYERS.map((player, index) => {
    return (
      <React.Fragment key={index}>
        {/* <Avatar name={player.name} index={player.avatarIndex} small={true} /> */}
        {createAvatar(player.name, player.avatarIndex)}
        {player.priority === null ? (
          <CardBack key={`back_${index}`} size="sm" absolute={false} />
        ) : (
          <Card card={player.priorityCard} size="small" />
        )}
      </React.Fragment>
    );
  });

  return (
    <div className={styles.container}>
      {gameState === 'picking seats' && currentSeatPicker && (
        <Alert variant="info">{`${
          currentSeatPicker === playerName
            ? 'You are '
            : `${currentSeatPicker} is `
        } picking a seat`}</Alert>
      )}
      <div className={styles.playersContainer}>{players}</div>
      {!playerPriorityCard ? displayChoosePriority() : displayChooseSeat()}
    </div>
  );
};

Lobby.propTypes = {};

export default Lobby;

const ColoredSquare = styled.div.attrs((props) => ({
  style: { background: props.color },
}))`
  width: 50px;
  height: 50px;
`;

const PriorityCard = styled.div.attrs((props) => ({
  style: { marginLeft: `${props.marginLeft}px` },
}))`
  position: absolute;
  top: 100px;
  left: -350px;
  cursor: pointer;
`;
