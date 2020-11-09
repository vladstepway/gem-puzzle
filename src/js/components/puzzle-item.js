import create from '../utils/create';
import * as constants from './../utils/constants';

export default class PuzzleItem {
  constructor(number, content, position) {
    this.number = number;
    this.content = content;
    this.position = position;
    const cellNumber = number === 0 ? '' : number;
    this.div = create('div', 'item', cellNumber, content);
    this.div.style.left = `${position.left * constants.CELL_SIZE}px`;
    this.div.style.top = `${position.top * constants.CELL_SIZE}px`;
    this.div.innerHTML = cellNumber;
  }
}
