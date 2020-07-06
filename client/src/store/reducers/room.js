import {
  SET_ROOM_ERROR,
  SET_ROOM_INFO,
  SET_ROOM_SEAT_INFO,
  UPDATE_ROOM_INFO,
} from '../actions/types';

const initialState = {
  loading: false,
  room: {
    seats: {},
  },
  currentMessage: null,
  oldMessages: null,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ROOM_ERROR:
      return {
        ...state,
        errors: payload,
      };
    case SET_ROOM_INFO:
      return {
        ...state,
        room: {
          ...state.room,
          ...payload,
        },
      };
    case SET_ROOM_SEAT_INFO:
      return {
        ...state,
        room: {
          ...state.room,
          seats: {
            ...state.room.seats,
            ...payload,
          },
        },
      };
    case UPDATE_ROOM_INFO:
      return {
        ...state,
        room: {
          ...state.room,
          ...payload,
        },
      };
    default:
      return state;
  }
}
