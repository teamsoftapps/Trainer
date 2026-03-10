import io from 'socket.io-client';
import {baseUrl} from './Urls';

class SocketService {
  socket = null;

  init(userId, role) {
    if (!this.socket) {
      console.log(
        'Initializing Global Socket for user:',
        userId,
        'role:',
        role,
      );
      this.socket = io(baseUrl, {
        transports: ['websocket', 'polling'],
        query: {userId, role},
        reconnection: true,
      });

      this.socket.on('connect', () => {
        console.log('✅ Global Socket Connected');
        this.socket.emit('joinUserRoom', {userId, role});
      });

      this.socket.on('conversationUpdated', data => {
        console.log('📬 Conversation Updated (Global):', data);
      });

      this.socket.on('connect_error', error => {
        console.log('❌ Global Socket Error:', error.message);
      });
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketInstance = new SocketService();
export default socketInstance;
