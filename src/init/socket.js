import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

//http 서버를 인자로 받아   새로운 Socket.IO 서버 인스턴스를 생성
const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server); // http 서버와  socket.IO서버를 연결

  registerHandler(io); //서버 헨들러를 등록
};

export default initSocket;
