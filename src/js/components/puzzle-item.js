import create from '../utils/create';

export default class PuzzleItem {
  constructor(number, content) {
    this.number = number;
    this.content = content;

    this.div = create('div', 'item', number, content);
    this.div.innerHTML = number;
  }
}
