(function(global:any) {
  if (typeof (global.jasmine) !== 'undefined') {
    (<any>jasmine).DEFAULT_TIMEOUT_INTERVAL = 2000;
    global.createSpy = jasmine.createSpy;
  }


  if (typeof (global.createSpy) === 'undefined') {
    global.createSpy = function(name) {
      var spy: any = function(...args) {
        spy.wasCalled = true;
        spy.lastArgs = args;
      }
      spy.wasCalled = false;
      spy.toString = function() {
        return `Spy: ${name}; called: ${spy.wasCalled}; with: ${spy.lastArgs && spy.lastArgs.join(', ')}`;
      }
      return spy;
    };
  }

  if (typeof (global.expect) === 'undefined') {
    global.expect = function(expectedValue) {
      return {
        not: {
          toBe: function (actualValue) {
            if (expectedValue === actualValue) {
              throw new Error(`Expected: ${expectedValue}, not to be actual: ${actualValue}.`);
            }
          },
          toThrow: function() {
            var threw = false;
            try {
              expectedValue();
            } catch (e) {
              threw = true;
            }
            if (threw) {
              throw new Error(`Expected ${expectedValue} not to throw, but it did.`);
            }
          },
          toHaveBeenCalled: function() {
            if (expectedValue.wasCalled) {
              throw new Error(`Expected: ${expectedValue} not to have been called.`);
            }
          }
        },
        toHaveBeenCalled: function() {
          if (!expectedValue.wasCalled) {
            throw new Error(`Expected: ${expectedValue} to have been called.`);
          }
        },
        toHaveBeenCalledWith: function(...args) {
          if (!expectedValue.wasCalled || !equals(expectedValue.lastArgs, args)) {
            throw new Error(`Expected: ${expectedValue} to have been called with ${args}.`);
          }
        },
        toEqual: function(actualValue) {
          if (!equals(expectedValue, actualValue)) {
            throw new Error(`Expected: ${expectedValue}, actual: ${actualValue}.`);
          }
        },
        toMatch: function(regexp) {
          if (!regexp.test(expectedValue)) {
            throw new Error(`Expected: ${expectedValue}, actual: ${regexp}.`);
          }
        },
        toBe: function(actualValue) {
          if (expectedValue !== actualValue) {
            throw new Error(`Expected: ${expectedValue}, actual: ${actualValue}.`);
          }
        },
        toContain: function(actualValue) {
          if (actualValue.indexOf(expectedValue) != -1) {
            throw new Error(`Expected: ${expectedValue}, actual: ${actualValue}.`);
          }
        },
        toBeDefined: function() {
          if (!expectedValue) {
            throw new Error(`Expected: ${expectedValue} toBe defined.`);
          }
        },
        toBeTruthy: function() {
          if (!expectedValue) {
            throw new Error(`Expected: ${expectedValue} toBe truthy.`);
          }
        },
        toBeFalsy: function() {
          if (!!expectedValue) {
            throw new Error(`Expected: ${expectedValue} toBe falsy.`);
          }
        },
        toThrow: function() {
          var threw = false;
          try {
            expectedValue();
          } catch (e) {
            threw = true;
          }
          if (!threw) {
            throw new Error(`Expected ${expectedValue} to throw, but it did not.`);
          }
        },
        toThrowError: function(error) {
          var threw = false;
          try {
            expectedValue();
          } catch (e) {
            threw = true;
            if (('' + e).indexOf(error) == -1) {
              throw new Error(`Expected to throw: ${error}, actual: ${e}.`);
            }
          }
          if (!threw) {
            throw new Error(`Expected ${expectedValue} to throw, but it did not.`);
          }
        }
      };
    };

    function equals(a, b) {
      if (a == b) {
        return true;
      } else if (a instanceof Array) {
        if (!(b instanceof Array)) return false;
        if (a.length != b.length) return false;
        for (var i = 0; i < a.length; i++) {
          if (!equals(a[i], b[i])) return false;
        }
        return true;
      } else if (a instanceof Object) {
        if (!(b instanceof Object)) return false;
        for(var key in a) {
          if (!equals(a[key], b[key])) return false;
        }
        for(var key in b) {
          if (!equals(a[key], b[key])) return false;
        }
        return true;
      }
      return false;
    }
  }
})(typeof window !== 'undefined' ? window : global);
