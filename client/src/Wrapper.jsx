import React from 'react';
import Logo from './components/Logo/Logo';
import Game from './pages/Game/Game';
import Row from 'react-bootstrap/Row';
import PlayerCreation from './pages/PlayerCreation/PlayerCreation';
import Lobby from './pages/Lobby/Lobby';
import { useSelector } from 'react-redux';

const Wrapper = () => {
  const playerName = useSelector((state) => state.player.player.name);
  const room = useSelector((state) => state.room.room);

  return (
    <>
      {playerName === null && (
        <>
          <Row noGutters className="justify-content-center">
            <Logo size="lg" />
          </Row>
          <Row noGutters className="justify-content-center">
            <PlayerCreation />
          </Row>
        </>
      )}
      {room.roomId && room.gameState !== 'starting' && (
        <>
          <Row noGutters className="justify-content-center">
            <Logo size="sm" />
          </Row>
          <Row noGutters className="justify-content-center">
            <Lobby />
          </Row>
        </>
      )}
      {room.roomId && room.gameState === 'starting' && <Game />}
      {/* <Game /> */}
    </>
  );
};

export default Wrapper;
