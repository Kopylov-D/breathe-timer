import {Button} from './Button';

export class MenuButton extends Button {
  constructor(selector, options) {
    super(selector, options);
  }

  toHTML() {
    return `
        <span></span>
  `;
  }

  get isOpen() {
    return this.$el.classList.contains('open');
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.$el.classList.add('open');
  }

  close() {
    this.$el.classList.remove('open');
  }
}
