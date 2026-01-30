import io from 'socket.io-client';
import {baseUrl} from '../services/Urls';

const SOCKET_URL = baseUrl;

class WSservice {
  socket = null;

  initializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      console.log('Initializing Socket', this.socket);

      this.socket.on('connect', data => {
        console.log('Socket Connected', data);
      });

      this.socket.on('disconnect', data => {
        console.log('Socket Disconnected', data);
      });

      this.socket.on('error', data => {
        console.log('Socket Error', data);
      });
    } catch (error) {
      console.log('Only Error', error);
    }
  };

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  emit(event, data) {
    this.socket?.emit(event, data);
  }

  removeListener(listName) {
    this.socket?.removeListener(listName);
  }
}

export const socketService = new WSservice();
