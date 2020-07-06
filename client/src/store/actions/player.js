import {
  PICK_A_CARD_FOR_SEAT,
  SET_PLAYER_ERROR,
  SET_PLAYER_INFO,
  UPDATE_PLAYER_INFO,
  PICK_A_CARD_FOR_PRIORITY,
} from './types';

export const playerPickACardForSeat = (payload) => (dispatch) => {
  dispatch({ type: PICK_A_CARD_FOR_SEAT, payload });
};

export const playerPickACardForPriority = (payload) => (dispatch) => {
  dispatch({ type: PICK_A_CARD_FOR_PRIORITY, payload });
};

export const setPlayerError = (payload) => (dispatch) => {
  dispatch({ type: SET_PLAYER_ERROR, payload });
};

export const setPlayerInfo = (payload) => (dispatch) => {
  dispatch({ type: SET_PLAYER_INFO, payload });
};

export const updatePlayerInfo = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_PLAYER_INFO, payload });
};
