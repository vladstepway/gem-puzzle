import create from '../utils/create';
import * as constants from './../utils/constants';

export default class PuzzleItem {
  constructor(number, content, position) {
    this.number = number;
    this.content = content;
    this.position = position;
    const cellNumber = number === 0 ? '' : number;
    const cellClass = number === 0 ? 'item-0' : 'item';
    this.div = create('div', cellClass, cellNumber, content);
    this.div.style.left = `${position.left * constants.CELL_SIZE}px`;
    this.div.style.top = `${position.top * constants.CELL_SIZE}px`;
    this.div.innerHTML = cellNumber;
  }
}
