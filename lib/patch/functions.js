'use strict';

var utils = require('../utils');
var wtf = require('../wtf');

function patchSetClearFunction(window, fnNames) {
  fnNames.forEach(function (setName) {
    var repeating = setName == 'setInterval';
    var isSetter = setName.indexOf('set') == 0;
    var is_request = setName.indexOf('request') == 0;
    var is_Request = setName.indexOf('Request') != -1;
    var isRaf = is_Request || is_request;
    var clearName;
    if (is_request) {
      clearName = setName.replace('request', 'cancel');
    } else if (is_Request) {
      clearName = setName.replace('Request', 'Cancel');
    } else {
      clearName = setName.replace('set', 'clear');
    }
    var setNative = window[setName];
    var clearNative = window[clearName];
    var ids = {};

    if (setNative) {
      var wtfSetEventFn = wtf.createEvent('Zone#' + setName + '(uint32 zone, uint32 id, uint32 delay)');
      var wtfClearEventFn = wtf.createEvent('Zone#' + clearName + '(uint32 zone, uint32 id)');
      var wtfCallbackFn = wtf.createScope('Zone#cb:' + setName + '(uint32 zone, uint32 id, uint32 delay)');

      // Forward all calls from the window through the zone.
      window[setName] = function () {
        return global.zone[setName].apply(global.zone, arguments);
      };
      window[clearName] = function () {
        return global.zone[clearName].apply(global.zone, arguments);
      };


      // Set up zone processing for the set function.
      Zone.prototype[setName] = function (callbackFn, delay) {
        var zone = this;
        var setId = null;
        // wrap the callback function into the zone.
        if (typeof callbackFn == 'function') {
          arguments[0] = function() {
            var callbackZone = zone.isRootZone() || isRaf ? zone : zone.fork();
            //var callbackZone = zone;
            var callbackThis = this;
            var callbackArgs = arguments;
            return wtf.leaveScope(
                wtfCallbackFn(callbackZone.$id, setId, delay),
                callbackZone.run(function() {
                  if (!repeating) {
                    delete ids[setId];
                    callbackZone.removeTask(callbackFn);
                  }
                  return callbackFn.apply(callbackThis, callbackArgs);
                })
            );
          };
        }
        if (repeating) {
          zone.addRepeatingTask(callbackFn);
        } else {
          zone.addTask(callbackFn);
        }
        setId = setNative.apply(window, arguments);
        ids[setId] = callbackFn;
        wtfSetEventFn(zone.$id, setId, delay);
        return setId;
      };

      // Set up zone processing for the clear function.
      Zone.prototype[clearName] = function (id) {
        var scope = wtfClearEventFn(this.$id, id);
        if (ids.hasOwnProperty(id)) {
          var callbackFn = ids[id];
          delete ids[id];
          if (repeating) {
            this.removeRepeatingTask(callbackFn);
          } else {
            this.removeTask(callbackFn);
          }
        }
        return clearNative.apply(window, arguments);
      };

    }
  });
};

function patchFunction(obj, fnNames) {
  fnNames.forEach(function (name) {
    var delegate = obj[name];
    global.zone[name] = function () {
      return delegate.apply(obj, arguments);
    };

    obj[name] = function () {
      return global.zone[name].apply(this, arguments);
    };
  });
};


module.exports = {
  patchSetClearFunction: patchSetClearFunction,
  patchFunction: patchFunction
};
