import create from '../utils/create';
import PuzzleItem from './puzzle-item';
import * as constants from './../utils/constants';

const main = create('main', '', null);
export default class PuzzleBoard {
  constructor({ size }) {
    // this.settings = settings;
    this.boardSize = size;
  }

  init() {
    this.container = create('div', 'puzzle', null, main);
    this.initInfoBoard();
    document.body.prepend(main);
    return this;
  }

  initInfoBoard() {
    this.infoBoard = create('div', 'puzzle__info', null, this.container);
    this.resetButton = create(
      'button',
      'reset_button',
      'reload',
      this.infoBoard
    );
    this.timeCount = '00:00';
    this.min = 0;
    this.sec = 0;
    this.timer = create(
      'div',
      'timer',
      `time ${this.timeCount}`,
      this.infoBoard
    );
    this.movesCount = 0;
    this.moves = create(
      'div',
      'moves',
      `moves ${this.movesCount}`,
      this.infoBoard
    );
    this.sizeBoard = create(
      'div',
      'size__board',
      `${this.boardSize}x${this.boardSize}`,
      this.infoBoard
    );
    this.menuButton = create('button', 'menu_button', 'menu', this.infoBoard);
    this.menuButton.addEventListener('click', this.openMenu);
    this.resetButton.addEventListener('click', this.reloadGame);
  }

  generatePuzzles() {
    this.timer.innerHTML = 'time 00:00';
    this.puzzles = [];
    this.currentPositions = [];
    // Puzzle content
    const puzzleContent = create(
      'div',
      'puzzle__content',
      null,
      this.container
    );
    this.puzzleContent = puzzleContent;
    puzzleContent.style.width = `${this.boardSize * constants.CELL_SIZE}px`;
    puzzleContent.style.height = `${this.boardSize * constants.CELL_SIZE}px`;

    this.createCells(puzzleContent);
    this.connectDroppable();
  }
  shufflePuzzles(puzzleAmount) {
    const randomPuzzle = [...Array(puzzleAmount).keys()].sort(
      () => Math.random() - 0.5
    );
    return this.isValidPuzzleCombination(puzzleAmount)
      ? randomPuzzle
      : this.shufflePuzzles(puzzleAmount);
  }

  isValidPuzzleCombination(randomPuzzle) {
    let sum = 0;
    for (let i = 0; i < randomPuzzle.length; i++) {
      let counter = 0;
      for (let j = i + 1; j < randomPuzzle.length - 1; j++) {
        if (randomPuzzle[i] > randomPuzzle[j]) {
          counter++;
        }
      }
      sum += counter;
    }
    return sum % 2 === 0;
  }

  createCells(puzzleContent) {
    const puzzleSize = this.boardSize * this.boardSize;
    const randomArray = this.shufflePuzzles(puzzleSize);
    for (let i = 0; i < randomArray.length; i++) {
      const left = i % this.boardSize;
      const top = (i - left) / this.boardSize;
      const position = { left, top };
      const value = randomArray[i];
      const item = new PuzzleItem(value, puzzleContent, position);
      if (value === 0) {
        this.emptyCell = item;
      }
      item.div.addEventListener('click', this.changePosition.bind(this, item));

      this.currentPositions.push({
        value,
        left: position.left,
        top: position.top,
        element: item,
      });
      this.puzzles.push(item);
    }
  }

  findPuzzleItem(item) {
    const currentPositionsCopy = JSON.parse(
      JSON.stringify(this.currentPositions)
    );
    const index = currentPositionsCopy
      .map((n) => (n.element ? n.element.number : 0))
      .indexOf(item.number);
    return this.currentPositions[index];
  }

  findPuzzleItemByValue(value) {
    const currentPositionsCopy = JSON.parse(
      JSON.stringify(this.currentPositions)
    );
    const index = currentPositionsCopy.map((n) => n.value).indexOf(+value);
    return this.currentPositions[index];
  }

  changePosition = (item) => {
    const emptyPuzzleCell = this.findPuzzleItem(this.emptyCell);
    const puzzleCell = this.findPuzzleItem(item);

    if (this.isNotClosestCell(puzzleCell, emptyPuzzleCell)) {
      return;
    } else {
      if (puzzleCell.value === emptyPuzzleCell.value) {
        return;
      } else {
        puzzleCell.element.div.style.left = `${
          emptyPuzzleCell.left * constants.CELL_SIZE
        }px`;
        emptyPuzzleCell.element.div.style.left = `${
          puzzleCell.left * constants.CELL_SIZE
        }px`;

        puzzleCell.element.div.style.top = `${
          emptyPuzzleCell.top * constants.CELL_SIZE
        }px`;
        emptyPuzzleCell.element.div.style.top = `${
          puzzleCell.top * constants.CELL_SIZE
        }px`;

        const emptyLeft = this.emptyCell.position.left;
        const emptyTop = this.emptyCell.position.top;

        this.emptyCell.left = puzzleCell.left;
        this.emptyCell.top = puzzleCell.top;
        this.emptyCell.position.left = puzzleCell.left;
        this.emptyCell.position.top = puzzleCell.top;

        emptyPuzzleCell.left = puzzleCell.left;
        emptyPuzzleCell.top = puzzleCell.top;

        puzzleCell.left = emptyLeft;
        puzzleCell.top = emptyTop;
        this.changeMovesCount(++this.movesCount);
        this.playSound('move');
      }
    }
    if (this.movesCount === 1) {
      this.timerId = setInterval(this.changeTimeCounter, 1000);
    }

    const isEndOfTheGame = this.currentPositions.every((p) => {
      return p.value === p.top * this.boardSize + p.left;
    });
    if (isEndOfTheGame) {
      this.endOfTheGame();
    }
  };
  playSound = (sound) => {
    const audio = new Audio();
    audio.src = `./sounds/${sound}.mp3`;
    audio.autoplay = true;
  };
  changeTimeCounter = () => {
    ++this.sec;
    if (this.sec === 60) {
      this.sec = 0;
      ++this.min;
    }
    if (this.min < 10) {
      if (this.sec < 10) {
        this.timer.innerHTML = `time 0${this.min}:0${this.sec}`;
      } else {
        this.timer.innerHTML = `time 0${this.min}:${this.sec}`;
      }
    } else {
      if (this.sec < 10) {
        this.timer.innerHTML = `time ${this.min}:0${this.sec}`;
      } else {
        this.timer.innerHTML = `time ${++this.min}:${this.sec}`;
      }
    }
  };

  isNotClosestCell(currentCell, emptyCell) {
    const leftDifference = Math.abs(emptyCell.left - currentCell.left);
    const topDifference = Math.abs(emptyCell.top - currentCell.top);
    return leftDifference + topDifference > 1;
  }

  endOfTheGame = () => {
    this.playSound('win');
    alert('You win');
  };

  reloadGame = () => {
    this.changeMovesCount(0);
    clearInterval(this.timerId);
    this.sec = 0;
    this.min = 0;
    this.container.removeChild(this.puzzleContent);

    this.generatePuzzles();
    this.playSound('reload');
  };
  changeMovesCount(count) {
    this.movesCount = count;
    this.moves.innerHTML = `moves ${this.movesCount}`;
  }

  connectDroppable() {
    let dragged = '';
    const puzzleContent = this.puzzleContent;
    puzzleContent.addEventListener('drag', (e) => {
      e.preventDefault();
      dragged = e.target;
    });
    puzzleContent.addEventListener('dragstart', (e) => {});
    puzzleContent.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    puzzleContent.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.target.innerText === '') {
        const puzzleItem = this.findPuzzleItemByValue(dragged.innerText);
        this.changePosition(puzzleItem.element);
      } else {
        return;
      }
    });
  }

  openMenu = () => {
    const menu = document.querySelector('.menu_overlay');
    menu.classList.add('menu_overlay-active');
    this.playSound('menu');
  };
}
