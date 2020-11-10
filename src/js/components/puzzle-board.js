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
    this.timer = create('div', 'timer', 'time', this.infoBoard);
    this.movesCount = 0;
    this.moves = create('div', 'moves', 'moves', this.infoBoard);
    this.sizeBoard = create(
      'div',
      'size__board',
      `${this.boardSize}x${this.boardSize}`,
      this.infoBoard
    );
    this.resetButton.addEventListener('click', this.reloadGame);
  }

  generatePuzzles() {
    this.puzzles = [];
    this.currentPositions = [];
    // Puzzle content
    const puzzleContent = create(
      'div',
      'puzzle__content',
      null,
      this.container
    );
    puzzleContent.style.width = `${this.boardSize * constants.CELL_SIZE}px`;
    puzzleContent.style.height = `${this.boardSize * constants.CELL_SIZE}px`;

    this.createCells(puzzleContent);
  }
  shufflePuzzles(puzzleAmount) {
    return [...Array(puzzleAmount).keys()].sort(() => Math.random() - 0.5);
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
        // this.emptyCell.value = value;
      }
      // console.log(item);
      // if (item.number !== 0) {
      item.div.addEventListener('click', this.changePosition.bind(this, item));
      // }

      this.currentPositions.push({
        value,
        left: position.left,
        top: position.top,
        element: item,
      });
      this.puzzles.push(item);
    }
  }

  changePosition = (item) => {
    const currentPositionsCopy = JSON.parse(
      JSON.stringify(this.currentPositions)
    );
    const currentCellIndex = currentPositionsCopy
      .map((n) => (n.element ? n.element.number : 0))
      .indexOf(item.number);
    const emptyCellIndex = currentPositionsCopy
      .map((n) => (n.element ? n.element.number : 0))
      .indexOf(this.emptyCell.number);
    const emptyPuzzleCell = this.currentPositions[emptyCellIndex];
    const puzzleCell = this.currentPositions[currentCellIndex];
    
    if (this.isNotClosestCell(puzzleCell, emptyPuzzleCell)) {
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
    }
    const isEndOfTheGame = this.currentPositions.every((p) => {
      return p.value === p.top * this.boardSize + p.left;
    });
    if (isEndOfTheGame) {
      this.endOfTheGame();
    }
  };

  isNotClosestCell(currentCell, emptyCell) {
    const leftDifference = Math.abs(emptyCell.left - currentCell.left);
    const topDifference = Math.abs(emptyCell.top - currentCell.top);
    console.log('leftDifference', leftDifference);
    console.log('rightDifference', topDifference);
    console.log(leftDifference + topDifference);
    console.log(leftDifference + topDifference > 1);
    return leftDifference + topDifference > 1;
  }

  endOfTheGame() {
    alert('You win');
  }

  reloadGame() {
    console.log('game is reloaded');
  }
}
