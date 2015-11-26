'use strict';

describe('setInterval', function () {

  it('should work with setInterval', function (done) {
    var testZone = zone.fork({
      addTask: function(fn) { wtfMock.log.push('addTask ' + fn.name ); },
      removeTask: function(fn) { wtfMock.log.push('removeTask ' + fn.name); },
      addRepeatingTask: function(fn) { wtfMock.log.push('addRepeatingTask ' + fn.name); },
      removeRepeatingTask: function(fn) { wtfMock.log.push('removeRepeatingTask ' + fn.name); },
    });

    var zId;
    var setIntervalId = '?';
    testZone.run(function() {
      zId = zone.$id;
      var cancelId = setInterval(function abc() {
        var zCallbackId = zone.$id;
        // creates implied zone in all callbacks.
        expect(zone).toBeDirectChildOf(testZone);

        clearInterval(cancelId);
        nativeSetTimeout(function() {
          expect(wtfMock.log).toEqual([
            'addRepeatingTask abc',
            '# Zone#setInterval(' + zId + ', ' + cancelId + ', 10)',
            '> Zone#cb:setInterval(' + zCallbackId + ', ' + cancelId + ', 10)',
            '# Zone#clearInterval(' + zCallbackId + ', ' + cancelId + ')',
            'removeRepeatingTask abc',
            '< Zone#cb:setInterval'
          ]);
          done();
        });
      }, 10);
      expect(wtfMock.log[0]).toEqual('addRepeatingTask abc');
      expect(wtfMock.log[1]).toEqual('# Zone#setInterval(' + zId + ', ' + cancelId + ', 10)');
    });
  });

});
