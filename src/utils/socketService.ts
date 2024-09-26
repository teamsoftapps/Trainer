import io from 'socket.io-client';
import {baseUrl} from '../services/Urls';

const SOCKET_URL = baseUrl;

class WSservice {
  socket: any;

  initializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      console.log('Initializing Socket', this.socket);

      this.socket.on('connect', (data: any) => {
        console.log('Socket Connected', data);
      });

      this.socket.on('disconnect', (data: any) => {
        console.log('Socket Disconnected', data);
      });

      this.socket.on('error', (data: any) => {
        console.log('Socket Error', data);
      });
    } catch (error) {
      console.log('Only Error', error);
    }
  };

  emit(event: any, data: object) {
    this.socket.on(event, data);
  }

  emit(event: any, cb: any) {
    this.socket.on(event, cb);
  }

  removeListener(listName: any) {
    this.socket.removeListener(listName);
  }
}
export const socketService = new WSservice();
