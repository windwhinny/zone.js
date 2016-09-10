// Karma configuration

module.exports = function (config) {
  require('./karma-abstract.conf')(config);
  var files = config.files;
  for (var i = 0; i < files.length; i++) {
    if(files[i] == '{{test-framework-patch}}') {
      files.splice(i, 1,
          '/base/node_modules/mocha/mocha.js',
          //'build/lib/mocha/mocha.js',
      );
    }
  }
  config.frameworks = ['mocha'];
  config.plugins.push('karma-mocha');
};
