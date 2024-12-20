import Item from './Item.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  //생성자에 정보 추가
  constructor(ctx, itemImages, scaleRatio, speed, itemUnlockTable) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.currentStage = 1000;
    this.itemUnlockTable = itemUnlockTable;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  //생성 정보 - 수정해야함
  createItem() {
    const stageItem = this.itemUnlockTable.find(
      (stage) => stage.stage_id === this.currentStage,
    ).item_id;
    if (stageItem) {
      const ServiceableItems = this.itemImages.filter((item) => stageItem.includes(item.id));
      const index = this.getRandomNumber(0, ServiceableItems.length - 1);
      const itemInfo = ServiceableItems[index];
      const x = this.canvas.width * 1.5;
      const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

      const item = new Item(
        this.ctx,
        itemInfo.ids,
        x,
        y,
        itemInfo.width / 1.5, //json으로 옮기며 빠진 크기 조정 넣어주기
        itemInfo.height / 1.5,
        itemInfo.image,
      );

      this.items.push(item);
    }
  }

  //현재 스테이지
  setCurrentStage(stageId) {
    this.currentStage = stageId;
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
