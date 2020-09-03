export class Component {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
  }

  toHTML() {
    throw new Error('Метод toHTML должен быть реализован!');
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler);
    this.$el.innerHTML = '';
  }
}
