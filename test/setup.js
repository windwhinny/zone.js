jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Capture the native setTimeout before zone patches it.
// This is so that we can execute things later (outside current zone)
// without the zone knowing about it.
global.nativeSetTimeout = global.setTimeout;

// When you have in async test (test with `done` argument) jasmine will
// execute the next test synchronously in the done handle. This makes sense
// for most tests, but now with zones. With zones running next test
// synchronously means that the current zone does not get cleared. This
// results in a chain of nested zones, which makes it hard to reason about
// it. We override the `clearStack` method which forces jasmine to always
// drain the stack before next test gets executed.
jasmine.QueueRunner = (function (SuperQueueRunner) {
  // Subclass the `QueueRunner` and override the `clearStack` mothed.

  function alwaysClearStack(fn) {
    global.nativeSetTimeout(fn, 0);
  }

  function QueueRunner(options) {
    options.clearStack = alwaysClearStack;
    SuperQueueRunner.call(this, options);
  }
  QueueRunner.prototype = SuperQueueRunner.prototype;
  return QueueRunner;
})(jasmine.QueueRunner);

// Setup tests for Zone without microtask support
require('../lib/browser/zone.js');
require('../lib/browser/long-stack-trace-zone.js');
