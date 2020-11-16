import create from '../utils/create';
import PuzzleItem from './puzzle-item';
import Timer from './timer';
import * as constants from './../utils/constants';

const main = create('main', 'main', null);
export default class PuzzleBoard {
  constructor({ size, moves, time, positions }) {
    this.boardSize = size;
    this.currentPositions = positions;
    this.time = time;
    this.movesCount = moves;
  }

  init() {
    this.container = create('div', 'puzzle', null, main);
    this.initInfoBoard();
    document.body.prepend(main);
    document
      .querySelector('.menu_overlay')
      .classList.remove('menu_overlay-active');

    return this;
  }

  initInfoBoard() {
    this.infoBoard = create('div', 'puzzle__info', null, this.container);
    this.resetButton = create(
      'img',
      'reset-image',
      '',
      this.infoBoard,
      ['src', './img/refresh.svg'],
      ['alt', 'refresh']
    );
    this.timeCounter = new Timer(this.infoBoard, this.time);
    this.timeCounter.init();
    this.moves = create('div', 'moves', `${this.movesCount}`, this.infoBoard);

    const sizeSettings = [];
    const sizes = {
      '4x4': 4,
      '3x3': 3,
      '5x5': 5,
      '6x6': 6,
      '7x7': 7,
      '8x8': 8,
    };
    for (const s in sizes) {
      sizeSettings.push(
        create('option', '', s, null, ['value', `${sizes[s]}`])
      );
    }

    this.sizeBoard = create(
      'select',
      'size__board',
      sizeSettings,
      this.infoBoard,
      ['id', 'board-size'],
      ['name', 'board-size']
    );

    this.menuButton = create(
      'img',
      'menu-img',
      '',
      this.infoBoard,
      ['src', './img/menu.svg'],
      ['alt', 'menu']
    );
    this.menuButton.addEventListener('click', this.openMenu);
    this.resetButton.addEventListener('click', this.reloadGame);
    this.sizeBoard.addEventListener('change', this.getSelectedBoardSize);
  }

  getSelectedBoardSize = () => {
    const sizeBoard = document.querySelector('#board-size');
    const screenSize = document.body.offsetWidth;
    const selectedValue = +sizeBoard.options[sizeBoard.options.selectedIndex]
      .value;
    if (
      (screenSize < 768 && selectedValue === 8) ||
      (screenSize < 500 && selectedValue === 7) ||
      (screenSize < 425 && selectedValue === 6) ||
      (screenSize < 375 && selectedValue === 5)
    ) {
      return;
    }
    this.boardSize = selectedValue;
    this.reloadGame();
  };

  generatePuzzles() {
    this.puzzles = [];
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
    if (this.currentPositions.length !== 0) {
      this.currentPositions.forEach((p) => {
        const item = new PuzzleItem(p.value, puzzleContent, {
          left: p.left,
          top: p.top,
        });
        if (p.value === 0) {
          this.emptyCell = item;
        }
        item.div.addEventListener(
          'click',
          this.changePosition.bind(this, item)
        );
        p.element = item;
        this.puzzles.push(item);
      });
    } else {
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
        item.div.addEventListener(
          'click',
          this.changePosition.bind(this, item)
        );

        this.currentPositions.push({
          value,
          left: position.left,
          top: position.top,
          element: item,
        });
        this.puzzles.push(item);
      }
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
      this.timeCounter.startTimer();
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
    this.timeCounter.resetTimer();
    this.container.removeChild(this.puzzleContent);
    this.currentPositions = [];
    this.generatePuzzles();
    this.playSound('reload');
  };
  changeMovesCount(count) {
    this.movesCount = count;
    this.moves.innerHTML = `${this.movesCount}`;
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
    this.timeCounter.pauseTimer();
    const menu = document.querySelector('.menu_overlay');
    menu.classList.add('menu_overlay-active');
    this.playSound('menu');
  };

  saveCurrentGame() {
    const positions = JSON.parse(JSON.stringify(this.currentPositions));
    const options = {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const saveDate = new Date().toLocaleString('en-US', options);
    const gameToSave = {
      size: this.boardSize,
      time: {
        value: this.timeCounter.time,
        min: this.timeCounter.min,
        sec: this.timeCounter.sec,
      },
      positions,
      moves: this.movesCount,
      saveDate,
    };
    return gameToSave;
  }
}
