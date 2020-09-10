
const toHTML = presets => {
  const items = presets.map(i => {
    return `
    <li data-type="name" data-id="${i.id}">${i.name}</li>
  `;
  });

  return `
    <h3>Breathing patterns</h3>
    <ul class="header__list">
      ${items.join('')}
    </ul>
 `;
};

export class Menu {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;

    this.presets = options.counterPresets;
    this.currentPreset = 0;

    this.#render();
    this.#setup();
  }

  #render() {
    this.$el.classList.add('header__menu');
    this.$el.innerHTML = toHTML(this.presets);
  }

  #setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener('click', this.clickHandler);
  }

  get isOpen() {
    return this.$el.classList.contains('open');
  }

  get current() {
    return this.currentPreset ? this.currentPreset : `Нет текущего выбора`;
  }

  click(func) {
    this.$el.addEventListener('click', func);
  }

  clickHandler(event) {
    const {type, id} = event.target.dataset;

    if (type === 'name') {
      this.currentPreset = this.presets.find(p => p.id == id).value;
    }
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

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler);
    this.$el.innerHTML = '';
  }
}
