import openSocket from 'socket.io-client';
import {
  OPEN_SOCKET,
  JOIN_A_ROOM,
  PICK_A_CARD_FOR_SEAT,
  PICK_A_CARD_FOR_PRIORITY,
  SET_ROOM_CURRENT_PLAYER_SELECTED_CARD,
  SET_ROOM_CURRENT_PLAYER_FINAL_CARD,
} from '../actions/types';

import { setRoomError, setRoomInfo, setRoomSeatInfo } from '../actions/room';

import { updateRoomInfo } from '../actions/room';

import {
  setPlayerError,
  setPlayerInfo,
  updatePlayerInfo,
} from '../actions/player';

let socket = null;
let URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';

const socketMiddleware = (store) => (next) => async (action) => {
  switch (action.type) {
    case OPEN_SOCKET:
      if (socket === null) {
        socket = openSocket(URL, {
          transports: ['websocket'],
          upgrade: false,
        });
        // socket.emit(
        //   'join a room',
        //   {
        //     roomId: 'room123',
        //   },
        //   (response) => {
        //     store.dispatch(
        //       setPlayerInfo({
        //         playerName: response.playerName,
        //         isHost: response.isHost,
        //       })
        //     );
        //   }
        // );
        // setTimeout(() => {
        //   console.log('is it here in setTimeout');
        //   socket.emit('pick a card for seat selection', {}, (response) => {
        //     console.log('seat select card = ', response);
        //     store.dispatch(updatePlayerInfo(response));
        //   });
        // }, 6000);
        socket.on('a card picked for seat selection', (response) => {
          store.dispatch(
            setRoomSeatInfo({
              [response.cardForSeat.color]: {
                playerName: response.playerName,
                playerAvatarIndex: response.playerAvatarIndex,
                cardForSeat: response.cardForSeat,
                cardForSeatIdx: response.cardForSeatIdx,
              },
            })
          );
        });
        socket.on('room joined', (response) => {
          store.dispatch(setRoomInfo(response));
        });
        socket.on('update room info', (response) => {
          store.dispatch(updateRoomInfo(response));
        });
        socket.on('update player info', (response) => {
          store.dispatch(updatePlayerInfo(response));
        });
      }
      break;
    case JOIN_A_ROOM:
      if (socket) {
        socket.emit('join a room', action.payload, (response) => {
          if (response.type === 'room error') {
            store.dispatch(
              setRoomError({
                message: response.message,
              })
            );
          } else if (response.type === 'player error') {
            store.dispatch(
              setPlayerError({
                message: response.message,
              })
            );
          } else {
            store.dispatch(setPlayerInfo(response));
          }
        });
      }
      break;
    case PICK_A_CARD_FOR_SEAT:
      if (socket) {
        socket.emit('pick a card for seat selection', action.payload);
      }
      break;
    case PICK_A_CARD_FOR_PRIORITY:
      if (socket) {
        socket.emit('pick a card for priority', action.payload);
      }
      break;
    case SET_ROOM_CURRENT_PLAYER_SELECTED_CARD:
      if (socket) {
        socket.emit('set room current player selected card', action.payload);
      }
      break;
    case SET_ROOM_CURRENT_PLAYER_FINAL_CARD:
      if (socket) {
        socket.emit('set room current player final card', action.payload);
      }
      break;
    default:
      break;
  }

  return next(action);
};

export default socketMiddleware;
