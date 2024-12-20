import { getUser, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';
// import { getGameAssets } from '../init/assets.js';

export const handleDisconnect = (socket, uuid) => {
  //서버 연결이 해제되는 함수
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUser());
};

export const handleConnection = (socket, uuid) => {
  // const assets = getGameAssets(); //assets 받아오기
  //소켓과  uuid를 인자로 받아 커넥션을 생성하는
  console.log(`New User Connected! : ${uuid} with socket ID ${socket.id}`);
  console.log(`Current users: `, getUser());

  createStage(uuid); // uuid를 인자로 받아 스테이지 생성

  socket.emit(`connection`, { uuid }); //테스트 위해 에셋 잠시 삭제
};

export const handlerEvent = (io, socket, data) => {
  //io. socket. data.를 받아
  // 클라이언트 버전 체크
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: '실패', message: 'Client version mismatch' });
    return;
  }
  // 핸들러 ID 체크
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: '실패', message: 'handlerId not found' });
    return;
  }
  //실행 시키는 함수
  const response = handler(data.userId, data.payload);
  // 브로드 캐스트
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }
  // 개인유저
  socket.emit('response', response);
};
