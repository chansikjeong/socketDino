import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
// express 서버열기
const app = express(); //express 애플리케이션 생성
const server = createServer(app); // http 서버 생성

const PORT = 3000; //포트 설정

app.use(express.json()); // json형식 요청 파싱
app.use(express.urlencoded({ extended: false })); // url encoded 형식 요청 파싱
app.use(express.static('public')); // public 폴더를 정적 파일서버로 설정
initSocket(server); //소켓 서버를 초기화하고 이벤트 핸들러 등록

// 기본 라우트 설정
app.get('/', (req, res, next) => {
  res.send('Hello World');
});

//서버 시작
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    //이 곳에서 파일 읽음 // 비동기적으로 게임 에셋을 로드함
    const assets = await loadGameAssets();
    console.log('Assets loaded successfully');
  } catch (err) {
    console.error('Failed to load game assets', err);
  }
});
