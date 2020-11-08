import PuzzleBoard from './js/components/puzzle-board';
import * as constants from './js/utils/constants';

const settings = { size: constants.DEFAULT_PUZZLE_SIZE };

new PuzzleBoard(settings).init().generatePuzzles();
