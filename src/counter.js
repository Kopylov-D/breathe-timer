const getTemplate = state => {
  const items = state.preset.map(item => {
    return `
  <li class="counter__item"  >
    <span>${item.name}</span>
    <button class="minus" data-type="minus" data-id="${item.id}">-</button>
    <span data-type="countNum">${item.value}</span>
    <button class="plus" data-type="plus" data-id="${item.id}">+</button>
  </li>
  `;
  });
  return `
   <div class="counter__period" data-type="period">
     <div class="counter__timeDown" data-type="timeDown">down</div>
     <div class="counter__time">${state.timer}:00</div>
     <div class="counter__timeUp" data-type="timeUp">up</div>
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
      timer: this.options.timer,
      preset: this.options.preset,
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

    this.#render();
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler);
    this.$el.innerHTML = '';
  }
}

// const getTemplate = (data = [], placeholder, selectedId) => {
//  let text = placeholder ?? 'Placeholder по умолчанию'

//  const items = data.map(item => {
//    let cls = ''
//    if (item.id === selectedId) {
//      text = item.value
//      cls = 'selected'
//    }
//    return `
//      <li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
//    `
//  })

//  return `
//    <div class="select__backdrop" data-type="backdrop"></div>
//    <div class="select__input" data-type="input">
//      <span data-type="value">${text}</span>
//      <i class="fa fa-chevron-down" data-type="arrow"></i>
//    </div>
//    <div class="select__dropdown">
//      <ul class="select__list">
//        ${items.join('')}
//      </ul>
//    </div>
//  `
// }

// export class Select {
//  constructor(selector, options) {
//    this.$el = document.querySelector(selector)
//    this.options = options
//    this.selectedId = options.selectedId

//    this.#render()
//    this.#setup()
//  }

//  #render() {
//    const {placeholder, data} = this.options
//    this.$el.classList.add('select')
//    this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
//  }

//  #setup() {
//    this.clickHandler = this.clickHandler.bind(this)
//    this.$el.addEventListener('click', this.clickHandler)
//    this.$arrow = this.$el.querySelector('[data-type="arrow"]')
//    this.$value = this.$el.querySelector('[data-type="value"]')
//  }

//  clickHandler(event) {
//    const {type} = event.target.dataset

//    if (type === 'input') {
//      this.toggle()
//    } else if (type === 'item') {
//      const id = event.target.dataset.id
//      this.select(id)
//    } else if (type === 'backdrop') {
//      this.close()
//    }
//  }

//  get isOpen() {
//    return this.$el.classList.contains('open')
//  }

//  get current() {
//    return this.options.data.find(item => item.id === this.selectedId)
//  }

//  select(id) {
//    this.selectedId = id
//    this.$value.textContent = this.current.value

//    this.$el.querySelectorAll('[data-type="item"]').forEach(el => {
//      el.classList.remove('selected')
//    })
//    this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

//    this.options.onSelect ? this.options.onSelect(this.current) : null

//    this.close()
//  }

//  toggle() {
//    this.isOpen ? this.close() : this.open()
//  }

//  open() {
//    this.$el.classList.add('open')
//    this.$arrow.classList.remove('fa-chevron-down')
//    this.$arrow.classList.add('fa-chevron-up')
//  }

//  close() {
//    this.$el.classList.remove('open')
//    this.$arrow.classList.add('fa-chevron-down')
//    this.$arrow.classList.remove('fa-chevron-up')
//  }

//  destroy() {
//    this.$el.removeEventListener('click', this.clickHandler)
//    this.$el.innerHTML = ''
//  }
// }

// export const model = [
//  {type: 'title', value: 'Test Title', options: {}},
//  {type: 'text', value: 'Exhale', options: {}},
//  {type: 'counter', value: [
//   5,
//    // '2 text',
//    // '3 text',
//    // '4 text',
//  ], options: {}},
// ]
