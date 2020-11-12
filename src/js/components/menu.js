import PuzzleBoard from './puzzle-board';
import create from '../utils/create';

export default class Menu {
  constructor(settings) {
    this.settings = settings;
  }

  init() {
    this.overlay = create('div', 'menu_overlay', null, null);
    this.menu = create('ul', 'menu', null, this.overlay);
    this.newGame = create('li', 'menu__item', 'New game', this.menu);
    this.continue = create('li', 'menu__item', 'Resume game', this.menu);
    this.save = create('li', 'menu__item', 'Save game', this.menu);
    this.reload = create('li', 'menu__item', 'Reload game', this.menu);
    this.overlay.classList.add('menu_overlay-active');
    document.body.prepend(this.overlay);

    this.newGame.addEventListener('click', this.startGame);
    this.continue.addEventListener('click', this.resumeGame);
    this.reload.addEventListener('click', this.reloadGame);
    this.save.addEventListener('click', this.saveGame);
  }

  startGame = () => {
    if (this.puzzleBoard) {
      const main = document.querySelector('main');
      main.removeChild(main.firstChild);
    }
    this.puzzleBoard = new PuzzleBoard(this.settings);
    this.puzzleBoard.init().generatePuzzles();
    this.puzzleBoard.playSound('new');
    this.overlay.classList.remove('menu_overlay-active');
  };

  resumeGame = () => {
    if (!this.puzzleBoard) {
      return;
    }
    this.puzzleBoard.playSound('resume');
    this.overlay.classList.remove('menu_overlay-active');
  };

  reloadGame = () => {
    if (!this.puzzleBoard) {
      return;
    }
    this.puzzleBoard.reloadGame();
    this.overlay.classList.remove('menu_overlay-active');
  };
  saveGame = () => {
    if (!this.puzzleBoard) {
      return;
    }
    this.playSound('save');
    this.overlay.classList.remove('menu_overlay-active');
  };
}
