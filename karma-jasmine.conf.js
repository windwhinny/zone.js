// Karma configuration

module.exports = function (config) {
  require('./karma-abstract.conf')(config);
  var files = config.files;
  for (var i = 0; i < files.length; i++) {
    if(files[i] == '{{test-framework-patch}}') {
      files[i] = 'build/lib/jasmine/jasmine.js';
    }
  }
  config.frameworks = ['jasmine'];
  config.plugins.push('karma-jasmine');
};
