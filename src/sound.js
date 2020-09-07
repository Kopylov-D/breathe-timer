export const context = new AudioContext();

let background;
let payback;
let sampleBuffer = [];

export function startSound(preset, timer, circleTime) {
 timer = timer * 60;
 play(preset, timer, circleTime)
}

export function stopSound() {
 stop()
}

//звук из файла
const url2 = './src/om.mp3';
const url3 = './src/zoi.mp3';

function fetchSound(url) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(res => {
      context.decodeAudioData(res, buffer => {
        sampleBuffer.push(buffer);
        console.log(sampleBuffer);
      });
    });
}

fetchSound(url2);
fetchSound(url3);

function setupBackground() {
  background = context.createBufferSource();
  background.buffer = sampleBuffer[1];

  background.loop = true;
  background.loopStart = 0;
  background.loopEnd = background.buffer.duration;

  const volume = context.createGain();
  volume.gain.value = 0.2;

  background.connect(volume);
  volume.connect(context.destination);
}

function formPayback(preset, timer, circleTime) {
  payback = context.createBufferSource();
  payback.buffer = sampleBuffer[0];
  let currTime = context.currentTime;
  const volume = context.createGain();

  const stainTime = 0;
  payback.loop = true;
  payback.loopStart = 0;
  payback.loopEnd = circleTime + stainTime;

  payback.connect(volume);

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
  formPayback(preset, timer, circleTime);
  payback.start(0);
  background.start(0);
}

function stop() {
  payback.stop(0);
  background.stop(0);
}

//Проигрывание с паузой и продолжением
// var startOffset = 0;
// var startTime = 0;
// var source;

// function play() {
//   startTime = context.currentTime;
//   source = context.createBufferSource();
//   // Connect graph
//   source.buffer = sampleBuffer;
//   source.loop = true;
//   source.connect(context.destination);
//   // Start playback, but make sure we stay in bound of the buffer.
//   source.start(0, startOffset % sampleBuffer.duration);
// }

// function pause() {
//   source.stop();
//   // Measure how much time passed since the last pause.
//   startOffset += context.currentTime - startTime;
// }

// function stop() {
//   source.stop();
//   startOffset = 0;
// }
