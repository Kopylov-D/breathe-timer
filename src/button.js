import {Component} from './dom';

export class Button extends Component {
  constructor(selector, name, options) {
    super(selector, options);

    this.name = name;

    this.#render();
    this.#setup();
  }

  #render() {
    this.$el.classList.add('button');
    this.$el.innerText = this.name;
  }

  #setup() {
    // this.clickHandler = this.clickHandler.bind(this);
    // this.$el.addEventListener('click', this.clickHandler);
  }

  toHTML() {
    return 'Start';
  }

  text(text) {
   this.$el.innerText = text;
  }

  click(...func) {
    this.$el.addEventListener('click', ...func);
  }

  disabled() {
    this.$el.disabled = 'true';
  }
}
