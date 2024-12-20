import { getStage, clearStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import { getItems, initializeItems } from '../models/item.model.js';

const calculateTotalScore = (stages, gameEndTime, isMoveStage, userItems) => {
  let totalScore = 0;

  const { stages: stageData, items: itemData } = getGameAssets();
  const stageTable = stageData.data;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }
    let stageRunTime = (stageEndTime - stage.timestamp) / 1000; //스테이지가 유지된 시간

    const stageInfo = stageTable.find((s) => s.id === stage.id);
    const scorePerSecond = stageInfo ? stageInfo.scorePerSecond : 1;

    if (!isMoveStage && index === stages.length - 1) {
      stageRunTime = Math.floor(stageRunTime); //정수부분만
    } else {
      stageRunTime = Math.round(stageRunTime); //반올림값
    }

    totalScore += stageRunTime * scorePerSecond; //스테이지마다 반영된 점수 계산
  });

  // 아이템 획득 점수 추가
  userItems.forEach((userItem) => {
    const item = itemData.data.find((item) => item.id === userItem.id);
    if (item) {
      totalScore += item.score;
    }
  });

  return totalScore;
};

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  //스테이지 비우기
  clearStage(uuid);
  //아이템 초기화
  initializeItems(uuid);
  //스테이지 세팅
  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success', handler: 2 };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트가 보내온 점수, 시간
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const userItems = getItems(uuid);

  if (!stages.length) {
    return { status: '실패', message: '스테이지값을 찾을 수 없습니다' };
  }

  // 총 점수
  const totalScore = calculateTotalScore(stages, gameEndTime, false, userItems);

  // 점수, 시간 검증
  if (Math.abs(totalScore - score) > 1) {
    return { status: '실패', message: '점수값이 올바르지 않습니다' };
  }

  //최고 점수 비교 등록 추가

  console.log(`totalScore: ${totalScore}`);
  console.log(`score: ${score}`);
  // saveGameResult(userId, clientScore, gameEndTime);

  // 검증이 통과되면 게임 종료 처리
  return { status: '성공', message: '게임이 성공적으로 종료 되었습니다', score, handler: 3 };
};

export default calculateTotalScore;
