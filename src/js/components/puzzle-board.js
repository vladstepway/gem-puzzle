import create from '../utils/create';
import PuzzleItem from './puzzle-item';

const main = create('main', '', null);

export default class PuzzleBoard {
  constructor(settings) {
    this.settings = settings;
  }

  init() {
    this.container = create('div', 'puzzle', null, main);
    this.infoBoard = create('div', 'info', null, this.container);

    this.timer = create('div', 'timer', null, this.infoBoard);
    this.moves = create('div', 'moves', null, this.infoBoard);
    this.sizeBoard = create('div', 'size__board', null, this.infoBoard);
    document.body.prepend(main);

    return this;
  }

  generatePuzzles() {
    this.puzzles = [];
    const puzzleSize = this.settings[0].size * this.settings[0].size;
    // Puzzle content
    const puzzleContent = create(
      'div',
      'puzzle__content',
      null,
      this.container,
    );
    console.log(this.settings[0].size);
    puzzleContent.style.gridTemplateColumns = `repeat(${this.settings[0].size}, 1fr)`;
    puzzleContent.style.gridTemplateRows = `repeat(${this.settings[0].size}, 1fr)`;
    console.log(puzzleContent);
    for (let i = 0; i < puzzleSize; i++) {
      const item = new PuzzleItem(i, puzzleContent);
      this.puzzles.push(item);
    }
    console.log(this.puzzles);
  }
}
