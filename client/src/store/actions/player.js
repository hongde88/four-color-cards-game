import {
  PICK_A_CARD_FOR_SEAT,
  SET_PLAYER_ERROR,
  SET_PLAYER_INFO,
  UPDATE_PLAYER_INFO,
  PICK_A_CARD_FOR_PRIORITY,
  UPDATE_PLAYER_CARD_ORDER,
  SET_PLAYER_SELECTED_CARD,
  REMOVE_PLAYER_SELECTED_CARD,
  SEND_PLAYER_ACTION,
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

export const updatePlayerCardOrder = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_PLAYER_CARD_ORDER, payload });
};

export const setPlayerSelectedCard = (payload) => (dispatch) => {
  dispatch({ type: SET_PLAYER_SELECTED_CARD, payload });
};

export const removePlayerSelectedCard = (payload) => (dispatch) => {
  dispatch({ type: REMOVE_PLAYER_SELECTED_CARD, payload });
};

export const sendPlayerAction = (payload) => (dispatch) => {
  dispatch({ type: SEND_PLAYER_ACTION, payload });
};
