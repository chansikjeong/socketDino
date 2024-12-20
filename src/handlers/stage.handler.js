import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import calculateTotalScore from './game.handler.js';
import { getItems } from '../models/item.model.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  let currentStages = getStage(userId);
  console.log(currentStages);
  if (!currentStages.length) {
    return { status: '실패', message: '유저 스테이지를 찾지 못했습니다' };
  }
  // 오름차순 정렬 후 최우측 ID 체크 / 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // payload 의 currentStage 와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: '실패', message: '현재 스테이지 값이 맞지 않습니다.' };
  }

  // 게임 에셋에서 스테이지 정보 가져오기
  const { stages } = getGameAssets();

  // 현재 스테이지의 정보를 stageTable 에서 가져옴
  const currentStageInfo = stages.data.find((stage) => stage.id === payload.currentStage);
  if (!currentStageInfo) {
    return { status: '실패', message: '현재 스테이지값 정보를 찾지 못했습니다.' };
  }

  // 목표 스테이지의 정보를 stageTable 에서 가져옴
  const targetStageInfo = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!targetStageInfo) {
    return { status: '실패', message: '다음 스테이지 값 정보를 찾지 못했습니다.' };
  }

  // 점수 검증
  const serverTime = Date.now();
  const userItems = getItems(userId);
  const totalScore = calculateTotalScore(currentStages, serverTime, true, userItems);

  if (targetStageInfo.score > totalScore) {
    return { status: '실패', message: '유효하지 않은 경과시간 값입니다' };
  }

  // 유저의 다음 스테이지 정보 업데이트 + 현재 시간
  setStage(userId, payload.targetStage, serverTime);
  return { status: '성공', handler: 11 };
};
