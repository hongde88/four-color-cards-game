import { combineReducers } from 'redux';
import room from './room';
import player from './player';

export default combineReducers({
  room,
  player,
});
