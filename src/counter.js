const getTemplate = ({timer, preset}) => {
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

    this.state = {
      timer: options.timer,
      preset: options.preset,
      circleTime: 27,
      isRunning: false
    };

    this.#render();
    this.#setup();
  }

  #render() {
    // const {data} = this.options;
    this.$el.classList.add('counter');
    this.$el.innerHTML = getTemplate(this.state);

    console.log('render');
  }

  //обращается здесь к дом элементам, так как один раз к дом, потом обращение к захешированным элементам
  #setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener('click', this.clickHandler);
  }

  clickHandler(event) {
    const {type, id} = event.target.dataset;
    const state = {...this.state};

    if (type === 'timeUp') {
      state.timer += 1;
    } else if (type === 'timeDown') {
      if (state.timer !== 0) {
        state.timer -= 1;
      }
    } else if (type === 'plus') {
      const preset = [...state.preset];

      state.preset = preset.map(item => {
        if (item.id === id) {
          item.value += 1;
        }
        return item;
      });
    } else if (type === 'minus') {
      const preset = [...state.preset];

      state.preset = preset.map(item => {
        if (item.id === id && item.value > 0) {
          item.value -= 1;
        }
        return item;
      });
    }

    this.state = state;
    this.setCircleTime();

    this.#render();
  }

  get isRunning() {
    return this.state.isRunning
  }

  toggle() {
    // this.isRunning ? 
  }

  setCircleTime() {
    let circleTime = 0;

    this.state.preset.forEach(item => {
      circleTime += item.value;
    });

    this.state.circleTime = circleTime;
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
