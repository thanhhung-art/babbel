import { io, Socket } from "socket.io-client";

export const chatSocket: Socket = io("http://localhost:3000/chat", {
  autoConnect: false,
  reconnection: false,
});

export const onlineSocket: Socket = io("http://localhost:3000/online", {
  autoConnect: false,
  reconnection: false,
});
