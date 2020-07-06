import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Wrapper from './Wrapper';

function App() {
  const store = configureStore();

  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  );
}

export default App;
