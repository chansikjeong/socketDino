const items = {};

//초기화
export const initializeItems = (userId) => {
  items[userId] = [];
};

//먹은거 기록해주기
export const eatItem = (userId, item) => {
  if (!items[userId]) {
    items[userId] = [];
  }
  items[userId].push(item);
};

//점수 계산을 위한 아이템 조회
export const getItems = (userId) => {
  return items[userId] || [];
};
