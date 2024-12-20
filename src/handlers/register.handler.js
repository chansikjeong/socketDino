import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  //생성한 서버를 받아 이벤트 핸들러를 등록하는 함수수
  io.on('connection', (socket) => {
    //connection이라는 이름의 접속시 이벤트
    //접속시 이벤트  (대기하는 함수)
    const userUUID = uuidv4(); //고유아이디 부여
    addUser({ uuid: userUUID, socketId: socket.id }); //유저를 등록하는 함수

    handleConnection(socket, userUUID);
    socket.on('event', (data) => handlerEvent(io, socket, data));
    // 접속 해제시 이벤트 (대기하는 함수)
    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
