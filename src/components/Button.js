export class Button {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;

    this.text = options.text;
    this.className = options.className;

    this.#render();
  }

  #render() {
    this.$el.classList.add(this.className);
    this.$el.innerHTML = this.toHTML();
  }

  toHTML() {
    return `${this.text}`;
  }

  innerText(text) {
    this.$el.innerText = text;
  }

  click(...func) {
    this.$el.addEventListener('click', ...func);
  }

  disable() {
    this.$el.disabled = 'true';
  }

  enable() {
    this.$el.disabled = '';
  }
}
