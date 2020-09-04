import '@/counter';
import '@/dom';

import {Counter} from './counter';

import './scss/index.scss';
import {Button} from './button';
import mp from './zoi.mp3';

const counter = new Counter('#counter', {
  timer: 8,
  preset: [
    {id: '1', value: 8, name: 'inhale'},
    {id: '2', value: 8, name: 'retain'},
    {id: '3', value: 8, name: 'exhale'},
    {id: '4', value: 3, name: 'sustain'},
  ],
});

let sound;

console.log(sound);

const button = new Button('#button', 'start', {});
const circle = document.querySelector('#circle');

function start() {
  const interval = setInterval(updateClock, 1000);

  if (counter.state.isRunning) {
    clearInterval(interval);
    counter.state.isRunning = false;
    button.text('start');
    counter.enable();
    sound.stop(0);
    return;
  }

  console.log('sourceBufferGlobal', sound);
  sound.start(0);

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

function con() {
  console.log('object');
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

//Звук

const context = new AudioContext();
let loadBuffer;

const url = 'https://dl.dropboxusercontent.com/s/47hgqffhjcsli6r/dinky-jam.mp3';

function loadSound(url) {
  let request = new XMLHttpRequest();

  request.open('GET', url, true);

  request.responseType = 'arraybuffer';
  request.send();

  request.onload = () => {
    context.decodeAudioData(request.response, buffer => {
      loadBuffer = buffer;
    });
    setupSound();
  };
}

loadSound(url);

function setupSound() {
  sound = context.createBufferSource();
  sound.buffer = loadBuffer;
  sound.connect(context.destination);
}

// const mySample = document.querySelector('.sounfile')
// const source = context.createMediaElementSource(mySample)

// source.connect(context.destination)

// mySample.play()

// console.log(context);

// const osc = context.createOscillator();
// const osc2 = context.createOscillator();

// console.log(osc);

// osc.type = 'triangle';
// osc2.type = 'triangle';

// const volume = context.createGain();
// volume.gain.value = 0.1;

// osc.connect(volume);
// osc2.connect(volume);
// volume.connect(context.destination);

// const duration = 2;

// var frequency = 493.883;

// osc.frequency.value = frequency;
// osc2.frequency.value = frequency+2;

// button.click(() => {
//   var startTime = context.currentTime;

//   con()

//   console.log(startTime);

//   volume.gain.setValueAtTime(0.1, startTime + duration - 0.05);
//   volume.gain.linearRampToValueAtTime(0, startTime + duration);

//   // Start the oscillators
//   // osc.start(startTime);

//   // Stop the oscillators 2 seconds from now
//   osc.stop(startTime + duration);

//   // osc2.stop(startTime + duration);
// });

// request.onload = function () {
//   var undecodedAudio = request.response;

//   console.log('response', request.response);

//   context.decodeAudioData(undecodedAudio, function (buffer) {
//     var sourceBuffer = context.createBufferSource();

//     console.log('sourceBuffer', sourceBuffer);

//     sourceBuffer.buffer = buffer;
//     sourceBuffer.connect(context.destination);
//     sourceBuffer.start(context.currentTime);
//   });
// };

// When to start playing the oscillators

// var context;
// window.addEventListener('load', init, false);
// function init() {
//   try {
//     // Fix up for prefixing
//     window.AudioContext = window.AudioContext||window.webkitAudioContext;
//     context = new AudioContext();
//   }
//   catch(e) {
//     alert('Web Audio API is not supported in this browser');
//   }
// }

// var dogBarkingBuffer = null;

// function loadDogSound(url) {
//   var request = new XMLHttpRequest();
//   request.open('GET', url, true);
//   request.responseType = 'arraybuffer';

//   // Decode asynchronously
//   request.onload = function() {
//     context.decodeAudioData(request.response, function(buffer) {
//       dogBarkingBuffer = buffer;
//     });
//   }
//   request.send();
// }
