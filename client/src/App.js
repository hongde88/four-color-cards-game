import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Logo from './components/Logo/Logo';
import Game from './pages/Game/Game';
import Row from 'react-bootstrap/Row';
import PlayerCreation from './pages/PlayerCreation/PlayerCreation';
import Lobby from './pages/Lobby/Lobby';

const STATES = ['player creation', 'lobby', 'game'];

function App() {
  const store = configureStore();

  const state = STATES[0];

  return (
    <Provider store={store}>
      {state === STATES[2] ? (
        <Game />
      ) : (
        <>
          <Row noGutters className="justify-content-center">
            <Logo size={state === STATES[0] ? 'lg' : 'sm'} />
          </Row>
          <Row noGutters className="justify-content-center">
            {state === STATES[0] ? <PlayerCreation /> : <Lobby />}
          </Row>
        </>
      )}
    </Provider>
  );
}

export default App;
