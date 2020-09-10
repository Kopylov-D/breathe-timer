import {startSound, stopSound} from '@/sound';
import {Menu} from '@/components/Menu';
import {Counter} from '@/components/Counter';
import {Button} from '@/components/Button';
import {MenuButton} from '@/components/MenuButton';

import '@/scss/index.scss';

const counter = new Counter('#counter', {
  timer: 1,
  preset: [
    {id: '1', value: 8, name: 'inhale'},
    {id: '2', value: 8, name: 'retain'},
    {id: '3', value: 8, name: 'exhale'},
    {id: '4', value: 3, name: 'sustain'},
  ],
});

const menu = new Menu('#menu', {
  counterPresets: [
    {id: '1', name: 'minutes breathe', value: '20,20,20,0'},
    {id: '2', name: '10 breathe', value: '10,10,10,4'},
    {id: '3', name: '4 breathe', value: '4,4,4,5'},
    {id: '4', name: '1 test', value: '1,1,1,1'},
    {id: '5', name: '2 test', value: '2,2,2,2'},
  ],
});

const buttonMenu = new MenuButton('#menu-btn', {
  text: '',
  className: 'header__menu-btn',
});

const buttonStart = new Button('#button', {
  text: 'loading...',
  className: 'button',
});

buttonStart.disable();

const circle = document.querySelector('#circle');
const commandText = document.querySelector('#command');

buttonMenu.click(toggleMenu);
menu.click(loadPreset);
buttonStart.click(start);

function loadPreset() {
  if (counter.isRunning) {
    toggleMenu();
    return;
  }
  let current = menu.current;
  current = current.split(',');
  counter.setPattern(current);
  toggleMenu();
}

function toggleMenu() {
  buttonMenu.toggle();
  menu.toggle();
}

export function startBtn() {
  buttonStart.enable();
  buttonStart.innerText('start');
}

function start() {
  const interval = setInterval(updateClock, 1000);
  const timer = document.querySelector('#timer');
  const minutes = timer.querySelector('#minutes');
  const seconds = timer.querySelector('#seconds');

  if (counter.isRunning) {
    clearInterval(interval);
    clearTimeouts();
    stopAnimation();
    buttonStart.innerText('start');
    counter.enable();
    stopSound();
    counter.run = false;
    commandText.innerText = '';
    minutes.textContent = counter.timer;
    seconds.textContent = '00';
    return;
  }

  const timerValue = counter.timer * 60 * 1000;
  const deadline = Date.now() + timerValue;

  counter.run = true;
  setCommands();

  startSound(counter.preset, counter.timer, counter.circleTime);
  startAnimation();
  counter.disable();
  buttonStart.innerText('stop');

  function updateClock() {
    const result = setTimeRemaining(deadline);
    minutes.textContent = result.minutes;
    seconds.textContent = result.seconds;

    if (deadline < Date.now() || !counter.isRunning) {
      clearInterval(interval);
      stopAnimation();
      stopSound();
      buttonStart.innerText('start');
      counter.run = false;
      counter.enable();

      minutes.textContent = counter.timer;
      seconds.textContent = '00';
    }
  }
}

function startAnimation() {
  circle.style.cssText = `
    transform: rotate(0); 
    animation: circle ${counter.circleTime}s linear infinite
  `;
}

function stopAnimation() {
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

function setCommandText(text) {
  if (counter.isRunning) {
    commandText.innerText = text;
  }
}

function clearTimeouts() {
  let id = window.setTimeout(function () {}, 0);
  while (id--) {
    window.clearTimeout(id);
  }
}

function setCommands() {
  const numCycles = (counter.timer * 60) / counter.circleTime;
  let i = 0;

  setCommands();

  function setCommands() {
    let timer = 0;
    setTimeout(() => setCommandText('Inhale'), 0);
    timer = counter.preset[0].value * 1000 + 1000;
    setTimeout(() => setCommandText('Retain'), timer);
    timer = timer + counter.preset[1].value * 1000 + 1000;
    setTimeout(() => setCommandText('Exhale'), timer);
    timer = timer + counter.preset[2].value * 1000 + 1000;
    setTimeout(() => setCommandText('Sustain'), timer);
    timer = timer + counter.preset[3].value * 1000 + 1000;

    if (i < numCycles && counter.isRunning) {
      i++;
      setTimeout(() => setCommands(), timer);
    }
  }
}
