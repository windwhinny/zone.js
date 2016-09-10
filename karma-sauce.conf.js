// Karma configuration
module.exports = function (config) {
  require('./karma-jasmine.conf.js')(config);
  require('./sauce.conf')(config);
};
