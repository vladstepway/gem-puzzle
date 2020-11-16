import Menu from './js/components/menu';
import * as constants from './js/utils/constants';

const settings = {
  size: constants.DEFAULT_PUZZLE_SIZE,
  moves: 0,
  time: { min: 0, sec: 0, value: '00:00' },
  positions: [],
};

new Menu(settings).init();