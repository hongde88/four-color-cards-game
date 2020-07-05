import openSocket from 'socket.io-client';
import { OPEN_SOCKET } from '../actions/types';

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
        //     console.log(response);
        //   }
        // );
        // socket.on('room joined', (response) => {});
      }
      break;
    default:
      break;
  }

  return next(action);
};

export default socketMiddleware;