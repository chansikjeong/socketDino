import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로 + assets 폴더의 문장이라 보면 된다.
const basePath = path.join(__dirname, '../../public/assets');

//파일 읽는 함수
//비동기 병렬로 파일을 읽는다.
const readFileAysnc = (filename) => {
  //비동기 처리하여 파일을 읽는 함수
  return new Promise((resolve, reject) => {
    //promise 객체 생성
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      //함수를 사용하여 파일을 읽는다
      //에러와 데이터를 읽을 수 있다.
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data)); //promise객체를 json객체 상태로 파싱하여 반환
    });
  });
};

// 호출시 바로 동작
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      //Promise.all으로 비동기적으로 3개의 파일을 읽어와 3개의 변수에 할당한다.
      readFileAysnc('stage.json'),
      readFileAysnc('item.json'),
      readFileAysnc('item_unlock.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks }; // 3개의 변수를 속성으로 할당
    return gameAssets; // 반환
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
