// Karma configuration

module.exports = function (config) {
  require('./karma.conf')(config);
  config.set({
    files: [
      'test/browser_entry_point.ts',
      'test/setup-microtask.ts',
      'test/**/*.spec.ts',
      {pattern: 'test/assets/**/*.*', watched: true, served: true, included: false},
      // Autowatcch all files to trigger rerun
      {pattern: 'lib/**/*.ts', watched: true, served: false, included: false},
      {pattern: 'test/**/*.ts', watched: true, served: false, included: false}
    ],

    preprocessors: {
      'test/browser_entry_point.ts': [ 'webpack', 'sourcemap' ],
      'test/setup-microtask.ts': [ 'webpack', 'sourcemap' ],
      'test/**/*.spec.ts': [ 'webpack', 'sourcemap' ],
    },

    exclude: []
  });
};
