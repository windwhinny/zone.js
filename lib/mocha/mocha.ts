'use strict';
((global: any) => {
  // Patch jasmine's describe/it/beforeEach/afterEach functions so test code
  // always runs
  // in a testZone (ProxyZone). (See: angular/zone.js#91 &
  // angular/angular#10503)
  const Mocha: any = global['Mocha'];
  if (!Zone)
    throw new Error("Missing: zone.js");
  if (typeof Mocha == 'undefined')
    throw new Error("Missing: mocha.js");
  if (Mocha['__zone_patch__'])
    throw new Error("'Mocha' has already been patched with 'Zone'.");
  Mocha['__zone_patch__'] = true;

  const SyncTestZoneSpec: {new (name: string) : ZoneSpec} =
      Zone['SyncTestZoneSpec'];
  const ProxyZoneSpec: {new () : ZoneSpec} = Zone['ProxyZoneSpec'];
  if (!SyncTestZoneSpec)
    throw new Error("Missing: SyncTestZoneSpec");
  if (!ProxyZoneSpec)
    throw new Error("Missing: ProxyZoneSpec");

  const ambientZone = Zone.current;
  // Create a synchronous-only zone in which to run `describe` blocks in order
  // to raise an
  // error if any asynchronous operations are attempted inside of a `describe`
  // but outside of
  // a `beforeEach` or `it`.
  const syncZone = ambientZone.fork(new SyncTestZoneSpec('Mocha.describe'));

  // This is the zone which will be used for running individual tests.
  // It will be a proxy zone, so that the tests function can retroactively
  // install
  // different zones.
  // Example:
  //   - In beforeEach() do childZone = Zone.current.fork(...);
  //   - In it() try to do fakeAsync(). The issue is that because the beforeEach
  //   forked the
  //     zone outside of fakeAsync it will be able to escope the fakeAsync
  //     rules.
  //   - Because ProxyZone is parent fo `childZone` fakeAsync can retroactively
  //   add
  //     fakeAsync behavior to the childZone.
  let testProxyZone: Zone = null;
  const original = {
    after : Mocha.after,
    afterEach : Mocha.afterEach,
    before : Mocha.before,
    beforeEach : Mocha.beforeEach,
    describe : Mocha.describe,
    it : Mocha.it
  };

  global.describe = Mocha.describe = function() {
    return original.describe.apply(this, wrapDescribeInZone(arguments));
  };

  global.xdescribe = Mocha.describe.skip = function() {
    return original.describe.skip.apply(this, wrapDescribeInZone(arguments));
  };

  Mocha.describe.only = function() {
    return original.describe.only.apply(this, wrapDescribeInZone(arguments));
  };

  global.it = Mocha.it = function() {
    return original.it.apply(this, wrapTestInZone(arguments));
  };

  global.it = Mocha.it = function() {
    return original.it.apply(this, wrapTestInZone(arguments));
  };

  global.xit = Mocha.it.skip = function() {
    return original.it.skip.apply(this, wrapTestInZone(arguments));
  };

  Mocha.it.only = function() {
    return original.it.only.apply(this, wrapTestInZone(arguments));
  };

  global.after = Mocha.after = function() {
    return original.after.apply(this, wrapTestInZone(arguments));
  };

  global.afterEach = Mocha.afterEach = function() {
    return original.afterEach.apply(this, wrapTestInZone(arguments));
  };

  global.before = Mocha.before = function() {
    return original.before.apply(this, wrapTestInZone(arguments));
  };

  global.beforeEach = Mocha.beforeEach = function() {
    return original.beforeEach.apply(this, wrapTestInZone(arguments));
  };

  /**
   * Gets a function wrapping the body of a Jasmine `describe` block to execute
   * in a
   * synchronous-only zone.
   */
  function wrapDescribeInZone(args: IArguments): any[] {
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (typeof arg == 'function') {
        args[i] = function() {
          return syncZone.run(arg, this, arguments as any as any[]);
        }
      }
    }
    return args as any;
  }

  /**
   * Gets a function wrapping the body of a Jasmine `it/beforeEach/afterEach`
   * block to
   * execute in a ProxyZone zone.
   * This will run in `testProxyZone`. The `testProxyZone` will be reset by the
   * `ZoneQueueRunner`
   */
  function wrapTestInZone(args: IArguments): any[] {
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (typeof arg == 'function') {
        // The `done` callback is only passed through if the function expects at
        // least one argument.
        // Note we have to make a function with correct number of arguments,
        // otherwise jasmine will
        // think that all functions are sync or async.
        args[i] = (arg.length == 0) ? function() {
          return testProxyZone.run(arg, this);
        } : function(done) { return testProxyZone.run(arg, this, [ done ]); };
      }
    }
    return args as any;
  }

  (function(originalRun) {
    Mocha.Runner.prototype.run = function(fn: Function) {
      this.on('test', (e) => {
        console.log('Test', e);
        if (Zone.current !== ambientZone) {
          throw new Error("Unexpected Zone: " + Zone.current.name);
        }
        testProxyZone = ambientZone.fork(new ProxyZoneSpec());
      });
      this.on('test end', (e) => {
        testProxyZone = null;
        console.log('Test End', e);
      });
      return originalRun.call(this, fn);
    };
  })(Mocha.Runner.prototype.run);

})(typeof window !== 'undefined' ? window : global);
