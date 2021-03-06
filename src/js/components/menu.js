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
    this.removePuzzleBoard();
    this.puzzleBoard = new PuzzleBoard(this.settings);
    this.puzzleBoard.init().generatePuzzles();
    this.puzzleBoard.playSound('new');
    this.removeGameList();
    this.overlay.classList.remove('menu_overlay-active');
  };

  resumeGame = () => {
    if (!this.puzzleBoard) {
      return;
    }
    this.puzzleBoard.timeCounter.resumeTimer();
    this.puzzleBoard.playSound('resume');
    this.removeGameList();
    this.overlay.classList.remove('menu_overlay-active');
  };

  reloadGame = () => {
    if (!this.puzzleBoard) {
      return;
    }
    this.puzzleBoard.reloadGame();
    this.removeGameList();
    this.overlay.classList.remove('menu_overlay-active');
  };

  removePuzzleBoard = () => {
    if (this.puzzleBoard) {
      const main = document.querySelector('main');
      main.removeChild(document.querySelector('.puzzle'));
      this.settings.positions = [];
      this.puzzleBoard.currentPositions = [];
      this.puzzleBoard = undefined;
    }
  };

  removeGameList = () => {
    if (this.gameList) {
      const menu = document.querySelector('.menu_overlay');
      menu.removeChild(document.querySelector('.game-list'));
      this.gameList = undefined;
    }
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
    this.removeGameList();
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
    this.removePuzzleBoard();
    this.puzzleBoard = new PuzzleBoard(selectedGame);
    this.puzzleBoard.init().generatePuzzles();
    this.removeGameList();
    this.puzzleBoard.playSound('load');
    this.puzzleBoard.timeCounter.resumeTimer();
  };

  getSavedGamesList = (games) => {
    this.gameList = create('ul', 'game-list', null, null);
    games.forEach((game) => {
      const savedGame = create('li', 'game-list__item', null, this.gameList);
      savedGame.innerHTML = `<div>size: ${game.size}, moves: ${game.moves},
       time: ${game.time.value} - ${game.saveDate}</div>`;
      savedGame.addEventListener('click', this.selectGame.bind(this, game));
    });
    document.querySelector('.menu_overlay').prepend(this.gameList);
  };
}
