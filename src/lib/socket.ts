import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (restaurantId: number): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3003';

  socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
  });

  socket.on('connect', () => {
    console.log('🔌 Kitchen Socket connected:', socket?.id);
    console.log('📍 Joining kitchen room for restaurant:', restaurantId);
    // Join kitchen room for this restaurant
    socket?.emit('join-kitchen', restaurantId);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
