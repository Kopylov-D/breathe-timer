const toHTML = (timer, preset, avg) => {
  const items = preset.map(item => {
    return `
  <li class="counter__item">
    <span>${item.name}</span> 
    <div>
      <button class="minus" data-type="minus" data-id="${item.id}">-</button>
      <span class="num" data-type="num">${item.value}</span>
      <button class="plus" data-type="plus" data-id="${item.id}">+</button>
    </div>
  </li>
  `;
  });
  return `
    <div><b>${avg}</b> breaths per minute</div>
    <div class="counter__period" data-type="period">
      <div class="counter__arrow material-icons" data-type="timeDown">
        expand_more
      </div>
      <div id="timer" class="counter__time">
          <span id="minutes">${timer}</span>
          <span>:</span>
          <span id="seconds">00</span>
      </div>
      <div class="counter__arrow material-icons" data-type="timeUp">
        expand_less
      </div>
    </div>
    <ul class="counter__list">
       ${items.join('')}
    </ul> 
   
`;
};

export class Counter {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;

    this.timer = options.timer;
    this.preset = options.preset;
    this.circleTime = 0;
    this.isRunning = false;
    this.avgBreaths = 0;

    this.#render();
    this.#setup();
  }

  #render() {
    this.setCircleTime();
    this.setAvg();

    if (!this.$el.classList.contains('counter')) {
      this.$el.classList.add('counter');
    }
    this.$el.innerHTML = toHTML(this.timer, this.preset, this.avgBreaths);

    console.log('render');
  }

  #setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener('click', this.clickHandler);
  }

  clickHandler(event) {
    const {type, id} = event.target.dataset;

    if (type === 'timeUp') {
      this.timer += 1;
    } else if (type === 'timeDown') {
      if (this.timer > 1) {
        this.timer -= 1;
      }
    } else if (type === 'plus') {
      this.preset = this.preset.map(item => {
        if (item.id === id) {
          item.value += 1;
        }
        return item;
      });
    } else if (type === 'minus') {
      this.preset = this.preset.map(item => {
        if (item.id === id && item.value > 0) {
          item.value -= 1;
        }
        return item;
      });
    }

    this.#render();
  }

  setPattern(pattern) {
    this.preset.map((item, i) => {
      item.value = +pattern[i];
      return item;
    });

    this.#render();
  }

  setCircleTime() {
    let circleTime = 0;

    this.preset.forEach(item => {
      circleTime += item.value;
      if (item.value > 0) {
        circleTime++;
      }
    });

    this.circleTime = circleTime;
  }

  setAvg() {
    this.avgBreaths = (60 / this.circleTime).toFixed(2);
  }

  set run(type) {
    return (this.isRunning = type);
  }

  get avg() {
    return this.avgBreaths;
  }

  disable() {
    this.$el.removeEventListener('click', this.clickHandler);
  }
  enable() {
    this.$el.addEventListener('click', this.clickHandler);
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler);
    this.$el.innerHTML = '';
  }
}
