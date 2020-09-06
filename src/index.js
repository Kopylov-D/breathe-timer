import '@/counter';
import '@/dom';

import {Counter} from './counter';

import './scss/index.scss';
import {Button} from './button';

import sm from './zoi.mp3';

// var sound1 = document.createElement('audio');
// sound1.src = './src/zoi.mp3';

// console.log(sm);

// const audioContext = new AudioContext();

// const audioElement = document.querySelector('audio');

// pass it into the audio context
// const track = audioContext.createMediaElementSource(sm);

// sm.connect(audioContext.destination);

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
let sampleBuffer;

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

  const timer = document.querySelector('#timer');
  const minutes = timer.querySelector('#minutes');
  const seconds = timer.querySelector('#seconds');
  const deadline = Date.now() + counter.state.timer * 60 * 1000;

  // setupSound();
  setupSoundFromOsc()
  sound.start(0);
  animationStart();
  counter.disable();

  button.text('stop');
  counter.state.isRunning = true;

  function updateClock() {
    const result = setTimeRemaining(deadline);
    minutes.textContent = result.minutes;
    seconds.textContent = result.seconds;

    if (deadline < Date.now() || !counter.state.isRunning) {
      clearInterval(interval);
      animationStop();
      sound.stop(0);

      minutes.textContent = counter.state.timer;
      seconds.textContent = '00';
    }
  }
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

const url = 'https://dl.dropboxusercontent.com/s/47hgqffhjcsli6r/dinky-jam.mp3';
const url2 = './src/om.mp3';

function fetchSound(url) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(res => {
      context.decodeAudioData(res, buffer => {
        sampleBuffer = buffer;
        setupSound();
      })
    })}

// fetchSound(url)
// fetchSound(url2);

function loadSound(url) {
  let request = new XMLHttpRequest();

  request.open('GET', url, true);

  request.responseType = 'arraybuffer';
  request.send();

  request.onload = () => {
    context.decodeAudioData(request.response, buffer => {
      sampleBuffer = buffer;
      setupSound(sampleBuffer);
    });
  };
}

function looper() {
  s = context.createOscillator()
  const volume = context.createGain()
  volume.gain.value = 0;
  volume.gain.linearRampToValueAtTime(1, context.currentTime + counter.preset[0].value/4);
  volume.connect(context.destination);

}

// loadSound(url2);

function setupSoundFromOsc() {
  sound = context.createOscillator()
  const volume = context.createGain();
  sound.connect(volume);
  volume.gain.value = 0;
  volume.gain.linearRampToValueAtTime(0.4, context.currentTime + 3);
  volume.connect(context.destination);
}

function setupSound() {
  sound = context.createBufferSource();
  sound.buffer = sampleBuffer;
  const volume = context.createGain();
  console.log(volume);
  sound.connect(volume);
  volume.gain.value = 0;
  volume.gain.linearRampToValueAtTime(0.8, context.currentTime + 5);
  // volume.gain.linearRampToValueAtTime(0, context.currentTime + 10);

  volume.connect(context.destination);
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
