import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  scoreIncrement = 0;
  currentStage = 1000;
  stageChange = {};

  constructor(ctx, scaleRatio, stageTable, itemTable, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable;
    this.itemTable = itemTable;
    this.itemController = itemController;

    this.stageTable.forEach((stage) => {
      this.stageChange[stage.id] = false;
    });
  }

  update(deltaTime) {
    const currentStageInfo = this.stageTable.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : 1;
    //스테이지 시간 점수 증가 / 조건식으로 주기적 추가
    this.scoreIncrement += deltaTime * 0.001 * scorePerSecond;
    if (this.scoreIncrement >= scorePerSecond) {
      this.score += scorePerSecond;
      this.scoreIncrement -= scorePerSecond;
    }

    this.stageChangeCheck();
  }
  //스테이지 체인지 검증
  stageChangeCheck() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      //점수가 스테이지 변경 점수 이상, 해당 스테이지 변경값을 가지고 있지 않은 경우
      if (
        Math.floor(this.score) >= stage.score &&
        stage.id !== 1000 &&
        !this.stageChange[stage.id]
      ) {
        const previousStage = this.currentStage;
        this.currentStage = stage.id;

        // 해당 스테이지로 변경 알림
        this.stageChange[stage.id] = true;

        // 서버 연락
        sendEvent(11, { currentStage: previousStage, targetStage: this.currentStage });

        // 아이템 컨트롤러 스테이지 세팅
        if (this.itemController) {
          this.itemController.setCurrentStage(this.currentStage);
        }
        console.log(this.currentStage);

        break;
      }
    }
  }
  //아이템 획득 점수
  getItem(itemId) {
    const itemIn = this.itemTable.find((item) => item.id === itemId);
    if (itemIn) {
      this.score += itemIn.score;
      sendEvent(16, { itemId, timestamp: Date.now() });
    }
  }

  reset() {
    this.score = 0;
    this.currentStage = 1000;
    this.scoreIncrement = 0;
    Object.keys(this.stageChange).forEach((key) => {
      this.stageChange[key] = false;
    });
    //아이템 컨트롤러 현재스테이지값 초기화
    if (this.itemController) {
      this.itemController.setCurrentStage(this.currentStage);
    }
  }

  //서버로 바꾸기
  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
