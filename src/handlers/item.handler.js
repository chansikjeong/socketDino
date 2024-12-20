import { eatItem } from '../models/item.model.js';
import { getGameAssets } from '../init/assets.js';
import { getStage } from '../models/stage.model.js';

//아이템 등 검증
export const handleItem = (userId, payload) => {
  //게임 에셋에서 아이템과 스테이지별 아이템 가져오기
  const { items, itemUnlocks } = getGameAssets();
  //시간 및 아이템 아이디 가져오기
  const { timestamp, itemId } = payload;

  // 아이템 정보 조회
  const item = items.data.find((item) => item.id === itemId);
  if (!item) {
    return { status: '실패', message: '유효하지 않은 아이템 ID값' };
  }

  // 유저의 현재 스테이지 정보 조회
  const currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: '실패', message: '유저 스테이지 값을 찾지 못했습니다' };
  }
  const currentStage = currentStages[currentStages.length - 1].id;

  // 현재 스테이지에서 나올 수 있는 아이템인지 검증
  console.log(itemUnlocks);
  const allowItems = itemUnlocks.data.find((stage) => stage.stage_id === currentStage).item_id;
  if (!allowItems.includes(itemId)) {
    return { status: '실패', message: '스테이지에 맞지 않는 아이템 값입니다' };
  }

  // 아이템 기록 추가
  eatItem(userId, { id: itemId, timestamp });
  return { status: '성공', handler: 16 };
};
