'use strict';

import {Zone} from '../browser/zone';
import * as microtask from '../microtask';
import * as browserPatch from '../patch/browser';
import * as es6Promise from 'es6-promise';

if (Zone.prototype.scheduleMicrotask) {
  console.warn('Zone-microtasks already exported on window the object!');
} else {
  microtask.addMicrotaskSupport(Zone);

  // Monkey patch the Promise implementation to add support for microtasks
  global.Promise = es6Promise.Promise;
}
