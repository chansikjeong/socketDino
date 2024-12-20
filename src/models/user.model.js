const users = [];
//유저 생성 함수
export const addUser = (user) => {
  //유저를 인자로 받아 유저 목록에 넣어주는 함수
  users.push(user);
};

//유저 삭제 함수
export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//유저 찾기
export const getUser = () => {
  return users;
};
