import { CLIENT_VERSION } from './Constants.js';
import { setScreen } from './index.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});
//클라이언트 저장 변수 선언
let userId = null;
// let stageDataTable = null;
// let itemDataTable = null;
// let itemUnlockDataTable = null;

socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  //받은 값들 할당
  userId = data.uuid;
  // stageDataTable = data.assets.stages.data;
  // itemDataTable = data.assets.items.data;
  // itemUnlockDataTable = data.assets.itemUnlocks.data;
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent }; //받아온값 내보내기 임시 수정
