import PuzzleBoard from './puzzle-board';
import create from '../utils/create';
import * as storage from '../utils/storage';

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
    this.load = create('li', 'menu__item', 'Load game', this.menu);

    this.overlay.classList.add('menu_overlay-active');
    document.body.prepend(this.overlay);

    this.savedGames = storage.get('savedGames')
      ? storage.get('savedGames')
      : [];

    this.newGame.addEventListener('click', this.startGame);
    this.continue.addEventListener('click', this.resumeGame);
    this.reload.addEventListener('click', this.reloadGame);
    this.save.addEventListener('click', this.saveGame);
    this.load.addEventListener('click', this.loadGame);
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
    this.puzzleBoard.timeCounter.resumeTimer();
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
    const currentGame = this.puzzleBoard.saveCurrentGame();
    this.savedGames.unshift(currentGame);
    storage.set('savedGames', this.savedGames);
    this.puzzleBoard.timeCounter.resumeTimer();
    this.puzzleBoard.playSound('save');
    this.overlay.classList.remove('menu_overlay-active');
  };

  loadGame = () => {
    if (document.querySelector('.game-list')) {
      return;
    }
    const games = this.savedGames;
    if (!games || games.length === 0) {
      return;
    }
    this.getSavedGamesList(games);
  };

  selectGame = (selectedGame) => {
    if (this.puzzleBoard) {
      this.puzzleBoard.currentPositions = [];
      const main = document.querySelector('main');
      main.removeChild(main.firstChild);
    }
    this.puzzleBoard = new PuzzleBoard(selectedGame);
    this.puzzleBoard.init().generatePuzzles();
    if (this.gameList) {
      const menu = document.querySelector('.menu_overlay');
      menu.removeChild(menu.firstChild);
    }
    this.puzzleBoard.playSound('load');
    this.puzzleBoard.timeCounter.resumeTimer();
  };

  getSavedGamesList = (games) => {
    this.gameList = create('ul', 'game-list', null, null);
    games.forEach((game) => {
      const savedGame = create('li', 'game-list__item', null, this.gameList);
      savedGame.innerHTML = `<div>Size: ${game.size}, moves: ${game.moves}, time: ${game.time.value}</div>`;
      savedGame.addEventListener('click', this.selectGame.bind(this, game));
    });
    document.querySelector('.menu_overlay').prepend(this.gameList);
  };
}
