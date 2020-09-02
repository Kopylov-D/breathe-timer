import '@/counter';
import '@/dom';

import {Counter} from './counter';

import './scss/index.scss';

const counter = new Counter('#counter', {
  timer: 8,
  preset: [
    {id: '1', value: 1, name: 'inhale'},
    {id: '2', value: 5, name: 'retain'},
    {id: '3', value: 8, name: 'exhale'},
    {id: '4', value: 9, name: 'sustain'},
  ],
});

window.counter = counter