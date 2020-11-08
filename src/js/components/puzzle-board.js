import create from '../utils/create';
import PuzzleItem from './puzzle-item';
import * as constants from './../utils/constants';

const main = create('main', '', null);
const emptyCell = {
  top: 0,
  left: 0,
};
export default class PuzzleBoard {
  constructor({ size }) {
    // this.settings = settings;
    this.boardSize = size;
  }

  init() {
    this.container = create('div', 'puzzle', null, main);
    this.infoBoard = create('div', 'puzzle__info', null, this.container);

    this.timer = create('div', 'timer', null, this.infoBoard);
    this.moves = create('div', 'moves', null, this.infoBoard);
    this.sizeBoard = create('div', 'size__board', null, this.infoBoard);
    document.body.prepend(main);
    this.initInfoBoard();
    return this;
  }

  initInfoBoard() {
    this.sizeBoard.innerHTML = `${this.boardSize}x${this.boardSize}`;
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
    this.createCells(puzzleContent);
  }

  createCells(puzzleContent) {
    const puzzleSize = this.boardSize * this.boardSize;
    this.currentPositions.push(emptyCell);
    for (let i = 1; i < puzzleSize; i++) {
      const left = i % this.boardSize;
      const top = (i - left) / this.boardSize;
      const position = { left, top };
      const item = new PuzzleItem(i, puzzleContent, position);
      item.div.addEventListener('click', this.changePosition.bind(this, item));

      this.currentPositions.push({
        left: position.left,
        top: position.top,
        element: item,
      });
      this.puzzles.push(item);
    }
  }

  changePosition = (item) => {
    const puzzleCell = this.currentPositions[item.number];
    if (this.isCloseCell(puzzleCell)) {
      return;
    } else {
      puzzleCell.element.div.style.left = `${
        emptyCell.left * constants.CELL_SIZE
      }px`;
      puzzleCell.element.div.style.top = `${
        emptyCell.top * constants.CELL_SIZE
      }px`;

      const { left, top } = emptyCell;

      emptyCell.left = puzzleCell.left;
      emptyCell.top = puzzleCell.top;

      puzzleCell.left = left;
      puzzleCell.top = top;
    }
  };

  isCloseCell(currentCell) {
    console.log(currentCell);
    const leftDifference = Math.abs(emptyCell.left - currentCell.left);
    const topDifference = Math.abs(emptyCell.top - currentCell.top);
    
    console.log(topDifference + leftDifference);
    return leftDifference + topDifference > 1;
  }
}
