(<any>jasmine).DEFAULT_TIMEOUT_INTERVAL = 2000;
(<any>window).global = window;

// Setup tests for Zone without microtask support
import '../lib/browser/zone';
import '../lib/browser/long-stack-trace-zone';

// Patch jasmine
import '../lib/browser/jasmine-patch';
