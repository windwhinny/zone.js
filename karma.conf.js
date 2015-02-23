// Karma configuration

var sauceConfig = require('./config/karma.sauce.conf');
var travisConfig = require('./config/karma.travis.conf');

module.exports = function(config) {
  var options = {
    frameworks: ['jasmine'],

    files: [
      'test/util.js',
      'zone.js',
      '*-zone.js',
      //'test/lib/brick.js',
      'test/**/*.spec.js',
      {pattern: 'test/assets/**/*.html', watched: true, served: true, included: false}
    ],

    browsers: ['Chrome']
  };

  if (process.argv.indexOf('--sauce') > -1) {
    sauceConfig(options);
    travisConfig(options);
  }

  config.set(options);
};
