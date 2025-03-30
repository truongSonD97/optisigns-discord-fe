import { io, Socket } from 'socket.io-client';
import { Message, receiveMessage } from '../redux/slices/chat/chatSlice';
import { store } from '@/src/redux/store';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (!this.socket) {
      console.log('Connecting to WebSocket...');
      this.socket = io(process.env.NEXT_PUBLIC_API_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
      });

      this.socket.on('receiveMessage', (message: any) => {
        // store.dispatch(receiveMessage(message));
      });
      
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(messageData: { 
    content: string;
    roomId: number;
    type: string;
  }) {
    this.socket?.emit('sendMessage', messageData);
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export default new SocketService();
