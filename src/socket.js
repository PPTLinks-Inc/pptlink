import { io } from 'socket.io-client';

// export const socket = io('http://10.42.0.1:4000', {
//   autoConnect: false,
//   pingTimeout: 10000, // Set the pingTimeout to 10 seconds (in milliseconds)
// });

export const socket = io('https://pptlink-node-backend.onrender.com/', {
  autoConnect: false,
  pingTimeout: 10000, // Set the pingTimeout to 10 seconds (in milliseconds)
});
