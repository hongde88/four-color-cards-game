import {
  SET_PLAYER_ERROR,
  SET_PLAYER_INFO,
  UPDATE_PLAYER_INFO,
  UPDATE_PLAYER_CARD_ORDER,
} from '../actions/types';

const initialState = {
  loading: false,
  player: {
    name: null,
    isHost: false,
    isYourTurn: false,
    cardForSeat: null,
  },
  cards: {
    cards: [],
    melded: [],
    discarded: [],
  },
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_PLAYER_ERROR:
      return {
        ...state,
        errors: payload,
      };
    case SET_PLAYER_INFO:
      return {
        ...state,
        player: {
          ...state.player,
          ...payload,
        },
      };
    case UPDATE_PLAYER_CARD_ORDER:
    case UPDATE_PLAYER_INFO:
      return {
        ...state,
        cards: {
          ...state.cards,
          ...payload,
        },
      };
    default:
      return state;
  }
}
