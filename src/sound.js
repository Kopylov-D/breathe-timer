import {startBtn} from './index';

let context;

try {
  context = new (window.AudioContext || window.webkitAudioContext)();
} catch (error) {
  window.alert(`Извините, но ваш браузер не поддерживает Web Audio API!`);
}

export function startSound(preset, timer, circleTime) {
  timer = timer * 60;
  play(preset, timer, circleTime);
}

export function stopSound() {
  stop();
}

let background;
let playback;
let sampleBuffer = [];

const stainTime = 1;
const backgroundUrl = './background.mp3';
const basisUrl = './tibe.mp3';

function fetchSound(url, type) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(res => {
      context.decodeAudioData(res, buffer => {
        sampleBuffer.push({type, buffer});
        if (sampleBuffer.length > 1) {
          startBtn();
        }
      });
    });
}

fetchSound(backgroundUrl, 'background');
fetchSound(basisUrl, 'basis');

function setupBackground() {
  background = context.createBufferSource();
  sampleBuffer.map(b => {
    if (b.type === 'background') {
      background.buffer = b.buffer;
    }
  });

  background.loop = true;
  background.loopStart = 0;
  background.loopEnd = background.buffer.duration;

  const volume = context.createGain();
  volume.gain.value = 0.08;

  background.connect(volume);
  volume.connect(context.destination);
}

function formPlayback(preset, timer, circleTime) {
  playback = context.createBufferSource();
  sampleBuffer.map(b => {
    if (b.type === 'basis') {
      playback.buffer = b.buffer;
    }
  });
  let currTime = context.currentTime;
  const volume = context.createGain();

  playback.loop = true;
  playback.loopStart = 0;
  playback.loopEnd = circleTime;

  playback.connect(volume);

  const cycles = timer / circleTime;

  for (let j = 0; j < cycles; j++) {
    for (let i = 0; i < preset.length; i++) {
      const duration = preset[i].value;
      const fadeTime = duration / 3;

      volume.gain.linearRampToValueAtTime(0, currTime);
      volume.gain.linearRampToValueAtTime(1, currTime + fadeTime);

      volume.gain.linearRampToValueAtTime(1, currTime + duration - fadeTime * 2);
      volume.gain.linearRampToValueAtTime(0, currTime + duration);

      currTime += duration + stainTime;
    }
  }

  volume.connect(context.destination);
}

function play(preset, timer, circleTime) {
  setupBackground();
  formPlayback(preset, timer, circleTime);
  playback.start(0);
  background.start(0);
}

function stop() {
  playback.stop(0);
  background.stop(0);
}
