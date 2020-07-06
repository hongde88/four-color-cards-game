import React, { useState } from 'react';
import CardBack from '../../components/CardBack/CardBack';
import styles from './Lobby.module.css';
import { range } from 'lodash';
import styled from 'styled-components/macro';
import Avatar from '../../components/Avatar/Avatar';
import Card from '../../components/Card/Card';

const PLAYERS = [
  {
    name: 'Ly',
    index: 0,
  },
  {
    name: 'Duc',
    index: 3,
  },
  {
    name: 'Mic',
    index: 1,
  },
  {
    name: 'Hoa',
    index: 2,
  },
];

const Lobby = () => {
  const getPlayerInfo = (player) => ({
    name: player.name,
    index: player.index,
    priorityCard: null,
    priority: null,
  });

  const [state, setState] = useState({
    players: PLAYERS.map((player) => getPlayerInfo(player)),
  });

  const updatePriorities = () => {
    const players = state.players;
    players[0].priorityCard = { character: 'general', color: 'green' };
    players[0].priority = 0;
    players[1].priorityCard = { character: 'soldier', color: 'white' };
    players[1].priority = 1;
    players[2].priorityCard = { character: 'soldier', color: 'white' };
    players[2].priority = 2;
    players[3].priorityCard = { character: 'soldier', color: 'white' };
    players[3].priority = 3;
    setState({ ...state, players });
  };

  const displayChoosePriority = () => {
    return (
      <div className={styles.table}>
        <h1>Bốc đi trước</h1>
        <div className={styles.priorityCards}>
          {range(30).map((index) => (
            <PriorityCard marginLeft={index * 30} onClick={updatePriorities}>
              <CardBack size="lg" />
            </PriorityCard>
          ))}
        </div>
      </div>
    );
  };

  const displayChooseSeat = () => (
    <div className={styles.table}>
      <h1>Bốc chỗ</h1>
      <ColoredSquare color={'green'} />
      <div className={styles.chooseSeatContainer}>
        <ColoredSquare color={'yellow'} />
        {range(4).map((index) => (
          <CardBack key={`back_${index}`} size="lg" />
        ))}
        <ColoredSquare color={'red'} />
      </div>
      <ColoredSquare color={'white'} />
    </div>
  );

  const players = state.players.map((player, index) => {
    return (
      <>
        <Avatar name={player.name} index={player.index} small={true} />
        {player.priority === null ? (
          <CardBack key={`back_${index}`} size="sm" absolute={false} />
        ) : (
          <Card card={player.priorityCard} size="small" />
        )}
      </>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.playersContainer}>{players}</div>
      {state.players[0].priorityCard === null
        ? displayChoosePriority()
        : displayChooseSeat()}
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
