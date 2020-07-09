import {
  JOIN_A_ROOM,
  SET_ROOM_ERROR,
  SET_ROOM_INFO,
  SET_ROOM_SEAT_INFO,
  UPDATE_ROOM_INFO,
  SET_ROOM_CURRENT_PLAYER_SELECTED_CARD,
  SET_ROOM_CURRENT_PLAYER_FINAL_CARD,
} from './types';

export const joinARoom = (payload) => (dispatch) => {
  dispatch({ type: JOIN_A_ROOM, payload });
};

export const setRoomError = (payload) => (dispatch) => {
  dispatch({ type: SET_ROOM_ERROR, payload });
};

export const setRoomInfo = (payload) => (dispatch) => {
  dispatch({ type: SET_ROOM_INFO, payload });
};

export const setRoomSeatInfo = (payload) => (dispatch) => {
  dispatch({ type: SET_ROOM_SEAT_INFO, payload });
};

export const updateRoomInfo = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_ROOM_INFO, payload });
};

export const setRoomCurrentPlayerSelectedCard = (payload) => (dispatch) => {
  dispatch({ type: SET_ROOM_CURRENT_PLAYER_SELECTED_CARD, payload });
};

export const setRoomCurrentPlayerFinalCard = (payload) => (dispatch) => {
  dispatch({ type: SET_ROOM_CURRENT_PLAYER_FINAL_CARD, payload });
};
