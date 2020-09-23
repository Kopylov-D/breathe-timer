import {startSound, stopSound} from '@/sound';
import {Menu} from '@/components/Menu';
import {Counter} from '@/components/Counter';
import {Button} from '@/components/Button';
import {MenuButton} from '@/components/MenuButton';

import '@/scss/index.scss';

const counter = new Counter('#counter', {
  timer: 1,
  preset: [
    {id: '1', value: 8, name: 'вдох'},
    {id: '2', value: 8, name: 'задержка'},
    {id: '3', value: 8, name: 'выдох'},
    {id: '4', value: 3, name: 'задержка'},
  ],
});

const menu = new Menu('#menu', {
  counterPresets: [
    {id: '1', name: 'минутное дыхание', value: '20,20,20,0'},
    {id: '2', name: 'дыхание 10', value: '10,10,10,4'},
    {id: '3', name: 'дыхание 4', value: '4,4,4,4'},
  ],
});

const buttonMenu = new MenuButton('#menu-btn', {
  text: '',
  className: 'header__menu-btn',
});

const buttonStart = new Button('#button', {
  text: 'загрузка...',
  className: 'button',
});

const circle = document.querySelector('#circle');
const commandText = document.querySelector('#command');

buttonStart.disable();
buttonMenu.click(toggleMenu);
menu.click(loadPreset);
buttonStart.click(toggleTimer);

export function enableStartBtn() {
  buttonStart.enable();
  buttonStart.innerText('старт');
}

function loadPreset() {
  let current = menu.current;
  current = current.split(',');
  counter.setPattern(current);
  toggleMenu();
}

function toggleMenu() {
  buttonMenu.toggle();
  menu.toggle();
}


function toggleTimer() {
  const timer = document.querySelector('#timer');
  const minutes = timer.querySelector('#minutes');
  const seconds = timer.querySelector('#seconds');

  if (counter.isRunning) {
    stopTimer(minutes, seconds);
    return;
  }
  startTimer(minutes, seconds)
}

function startTimer(minutes, seconds) {
  setInterval(updateClock, 1000);

  const circleTime = counter.circleTime;
  const timerValue = Math.round((counter.timer * 60) / circleTime) * circleTime * 1000;

  const deadline = Date.now() + timerValue;

  counter.run = true;
  setCommands();
  startSound(counter.preset, counter.timer, counter.circleTime);
  startAnimation();
  counter.disable();
  buttonStart.innerText('стоп');

  function updateClock() {
    const result = setTimeRemaining(deadline);
    minutes.textContent = result.minutes;
    seconds.textContent = result.seconds;

    if (deadline < Date.now() || !counter.isRunning) {
      stopTimer(minutes, seconds);
    }
  }
}

function stopTimer(minutes, seconds) {
  clearTimeouts();
  stopAnimation();
  stopSound();
  setCommandText('');
  buttonStart.innerText('старт');
  counter.enable();
  counter.run = false;
  minutes.textContent = counter.timer;
  seconds.textContent = '00';
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
    setTimeout(() => setCommandText(counter.preset[0].name), 0);
    timer = counter.preset[0].value * 1000 + 1000;
    setTimeout(() => setCommandText(counter.preset[1].name), timer);
    timer = timer + counter.preset[1].value * 1000 + 1000;
    setTimeout(() => setCommandText(counter.preset[2].name), timer);
    timer = timer + counter.preset[2].value * 1000 + 1000;
    setTimeout(() => setCommandText(counter.preset[3].name), timer);
    timer = timer + counter.preset[3].value * 1000 + 1000;

    if (i < numCycles && counter.isRunning) {
      i++;
      setTimeout(() => setCommands(), timer);
    }
  }
}
