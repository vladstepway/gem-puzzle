import Menu from './js/components/menu';
import * as constants from './js/utils/constants';

const settings = { size: constants.DEFAULT_PUZZLE_SIZE };

new Menu(settings).init();
// new PuzzleBoard(settings).init().generatePuzzles();
