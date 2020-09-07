// import '@/counter';
import '@/dom';
import {startSound, stopSound, context} from '@/sound';

import {Counter} from './counter';
import {Button} from './button';

import './scss/index.scss';

const counter = new Counter('#counter', {
  timer: 8,
  preset: [
    {id: '1', value: 8, name: 'inhale'},
    {id: '2', value: 8, name: 'retain'},
    {id: '3', value: 8, name: 'exhale'},
    {id: '4', value: 2, name: 'sustain'},
  ],
});

const button = new Button('#button', 'start');
const circle = document.querySelector('#circle');

function start() {
  const interval = setInterval(updateClock, 1000);

  if (counter.isRunning) {
    clearInterval(interval);
    button.text('start');
    counter.enable();
    stopSound();
    counter.isRunning = false;
    return;
  }

  const timer = document.querySelector('#timer');
  const minutes = timer.querySelector('#minutes');
  const seconds = timer.querySelector('#seconds');
  const deadline = Date.now() + counter.timer * 60 * 1000;

  startSound(counter.preset, counter.timer, counter.circleTime);
  animationStart();
  counter.disable();

  button.text('stop');
  counter.isRunning = true;

  function updateClock() {
    const result = setTimeRemaining(deadline);
    minutes.textContent = result.minutes;
    seconds.textContent = result.seconds;

    if (deadline < Date.now() || !counter.isRunning) {
      clearInterval(interval);
      animationStop();
      stopSound();
      button.text('start');
      counter.isRunning = false;
      counter.enable();

      minutes.textContent = counter.timer;
      seconds.textContent = '00';
    }
  }
}

button.click(start);

function animationStart() {
  circle.style.cssText = `
    transform: rotate(0); 
    animation: circle ${counter.circleTime}s linear infinite
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
