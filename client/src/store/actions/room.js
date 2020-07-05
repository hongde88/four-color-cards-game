import {
  JOIN_A_ROOM,
  SET_ROOM_ERROR,
  SET_ROOM_INFO,
  SET_ROOM_SEAT_INFO,
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
