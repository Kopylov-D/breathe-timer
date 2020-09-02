const counterItems = document.querySelectorAll('[data-type="countNum"]');
const startBtn = document.querySelector('#start');

const plusBtn = document.querySelector('#counter');
const minusBtn = document.querySelector('#counter')

console.log(plusBtn)

// minusBtn.addEventListener('click', (e) => console.log(e))


const counter = {
  inhale: 5,
  retain: 2,
  exhale: 1,
  sustain: 3,
};

const start = () => {
  console.log('start');

  Object.keys(counter).forEach((key, i) => {
    counter[key] = counterItems[i].textContent;
  });

  console.log(counter);
};



// startBtn.addEventListener('click', start);
