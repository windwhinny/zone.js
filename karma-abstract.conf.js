// Karma configuration

module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      'build/test/wtf_mock.js',
      'build/lib/zone.js',
      'build/lib/zone-spec/async-test.js',
      'build/lib/zone-spec/fake-async-test.js',
      'build/lib/zone-spec/long-stack-trace.js',
      'build/lib/zone-spec/proxy.js',
      'build/lib/zone-spec/sync-test.js',
      'build/lib/zone-spec/task-tractking.js',
      'build/lib/zone-spec/wtf.js',
      '{{test-framework-patch}}',
      'node_modules/systemjs/dist/system.src.js',
      {pattern: 'test/assets/**/*.*', watched: true, served: true, included: false},
      {pattern: 'build/**/*.js.map', watched: true, served: true, included: false},
      {pattern: 'build/**/*.js', watched: true, served: true, included: false},
      'build/test/karma-main.js'
    ],

    plugins: [
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-sourcemap-loader'),
    ],

    preprocessors: {
      '**/*.js': ['sourcemap']
    },

    exclude: [
      'test/microtasks.spec.ts'
    ],

    reporters: ['progress'],

    //port: 9876,
    colors: true,

    logLevel: config.LOG_INFO,

    browsers: ['Firefox'],

    captureTimeout: 60000,

    autoWatch: true,
    singleRun: false
  });
};
