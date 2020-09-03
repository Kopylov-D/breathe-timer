import '@/counter';
import '@/dom';

import {Counter} from './counter';

import './scss/index.scss';
import {Button} from './button';

const counter = new Counter('#counter', {
  timer: 8,
  preset: [
    {id: '1', value: 1, name: 'inhale'},
    {id: '2', value: 5, name: 'retain'},
    {id: '3', value: 8, name: 'exhale'},
    {id: '4', value: 9, name: 'sustain'},
  ],
});

const button = new Button('#button', 'start', {});
const circle = document.querySelector('#circle');

function start() {
  const interval = setInterval(updateClock, 1000);

  if (counter.state.isRunning) {
    clearInterval(interval);
    counter.state.isRunning = false;
    button.text('start');
    counter.enable();
    return;
  }

  button.text('stop');

  counter.state.isRunning = true;

  const timer = document.querySelector('#timer');
  const minutes = timer.querySelector('#minutes');
  const seconds = timer.querySelector('#seconds');

  const deadline = Date.now() + counter.state.timer * 60 * 1000;

  function updateClock() {
    const result = setTimeRemaining(deadline);
    minutes.textContent = result.minutes;
    seconds.textContent = result.seconds;

    if (deadline < Date.now() || !counter.state.isRunning) {
      clearInterval(interval);
      animationStop();
      minutes.textContent = counter.state.timer;
      seconds.textContent = '00';
    }
  }

  animationStart();
  counter.disable();
}

button.click(start);

function animationStart() {
  circle.style.cssText = `
    transform: rotate(0); 
    animation: circle ${counter.state.circleTime}s linear infinite
  `;
}

function animationStop() {
  circle.style.cssText = `
    transform: rotate(0); 
    animation: none
  `;
}

function setTimeRemaining(deadline) {
  const total = deadline - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor(total / 1000 / 60);

  const prettify = num => (num < 10 ? `0${num}` : num);

  return {
    total,
    minutes: prettify(minutes),
    seconds: prettify(seconds),
  };
}
