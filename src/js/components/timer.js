import create from '../utils/create';

export default class Timer {
  constructor(infoBoard, time) {
    this.min = time.min;
    this.sec = time.sec;
    this.info = infoBoard;
    this.time = `${this.addZero(this.min)}:${this.addZero(this.sec)}`;
  }

  init = () => {
    this.timer = create('div', 'timer', `${this.getTimer()}`, this.info);
  };

  getTimer = () => {
    return this.time;
  };
  startTimer = () => {
    this.timerId = setInterval(this.changeTimeCounter, 1000);
    setInterval(this.getTimer, 1000);
  };
  pauseTimer = () => {
    clearInterval(this.timerId);
  };
  resumeTimer = () => {
    this.timerId = setInterval(this.changeTimeCounter, 1000);
  };
  resetTimer = () => {
    clearInterval(this.timerId);
    this.sec = 0;
    this.min = 0;
    this.time = '00:00';
    document.querySelector('.timer').innerHTML = this.time;
  };

  changeTimeCounter = () => {
    ++this.sec;
    if (this.sec === 60) {
      this.sec = 0;
      ++this.min;
    }
    this.time = `${this.addZero(this.min)}:${this.addZero(this.sec)}`;
    this.timer.innerHTML = this.time;
  };

  addZero = (n) => {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
  };
}
